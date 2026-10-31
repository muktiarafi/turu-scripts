/*
name: Castle Uniforms Merge
description: This bot will farm the items belonging to the selected mode for the Castle Uniforms Merge [2717] in /swordhavengardens
tags: castle, uniforms, merge, swordhavengardens, darkovia, dusk, steward, duskfall, eagle, familiar, wolfsbane, silverware, set, dacian, wolf, darkovian, dainty, silver, meatcarvers, butler, morph, maid, broom, besom, meatcarver
*/
// Port of Scripts/Other/MergeShops/CastleUniformsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CastleUniformsMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                Core.logger("req is NULL");
                return;
            }

            switch (req.name) {
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(
                        `The bot hasn't been taught how to get ${req.name}.` +
                            (shouldStop ? " Please report the issue." : " Skipping"),
                        undefined,
                        { messageBox: shouldStop, stopBot: shouldStop },
                    );
                    break;
                }
                //#endregion
                //#region Items not setup
                case "Cavendish Dusk Crest":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10723);
                    // TODO: Replace with actual quest ID
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("swordhavengardens", "Queen's Crocus", "Crocus Poison", 4, { isTemp: true });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("swordhavengardens", 2717, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "100909",
            "Darkovia Dusk Steward",
            'Mode: [select] only\nShould the bot buy "Darkovia Dusk Steward" ?',
            false,
        ),
        option.bool(
            "100914",
            "Duskfall Eagle Familiar",
            'Mode: [select] only\nShould the bot buy "Duskfall Eagle Familiar" ?',
            false,
        ),
        option.bool(
            "100915",
            "Wolfsbane Silverware Set",
            'Mode: [select] only\nShould the bot buy "Wolfsbane Silverware Set" ?',
            false,
        ),
        option.bool(
            "100916",
            "Dacian Wolf Familiar",
            'Mode: [select] only\nShould the bot buy "Dacian Wolf Familiar" ?',
            false,
        ),
        option.bool(
            "100918",
            "Darkovian Silverware Set",
            'Mode: [select] only\nShould the bot buy "Darkovian Silverware Set" ?',
            false,
        ),
        option.bool(
            "100920",
            "Dainty Silver Meatcarvers",
            'Mode: [select] only\nShould the bot buy "Dainty Silver Meatcarvers" ?',
            false,
        ),
        option.bool(
            "100922",
            "Wolfsbane Silver Daggers",
            'Mode: [select] only\nShould the bot buy "Wolfsbane Silver Daggers" ?',
            false,
        ),
        option.bool(
            "100910",
            "Dusk Butler Morph",
            'Mode: [select] only\nShould the bot buy "Dusk Butler Morph" ?',
            false,
        ),
        option.bool(
            "100911",
            "Dusk Maid Visage",
            'Mode: [select] only\nShould the bot buy "Dusk Maid Visage" ?',
            false,
        ),
        option.bool(
            "100912",
            "Dusk Butler Hair",
            'Mode: [select] only\nShould the bot buy "Dusk Butler Hair" ?',
            false,
        ),
        option.bool("100913", "Dusk Maid Locks", 'Mode: [select] only\nShould the bot buy "Dusk Maid Locks" ?', false),
        option.bool(
            "100923",
            "Duskfall Eagle Broom",
            'Mode: [select] only\nShould the bot buy "Duskfall Eagle Broom" ?',
            false,
        ),
        option.bool(
            "100924",
            "Duskfall Wolf Besom",
            'Mode: [select] only\nShould the bot buy "Duskfall Wolf Besom" ?',
            false,
        ),
        option.bool(
            "100921",
            "Wolfsbane Silver Dagger",
            'Mode: [select] only\nShould the bot buy "Wolfsbane Silver Dagger" ?',
            false,
        ),
        option.bool(
            "100919",
            "Dainty Silver Meatcarver",
            'Mode: [select] only\nShould the bot buy "Dainty Silver Meatcarver" ?',
            false,
        ),
        option.bool(
            "100917",
            "Darkovian Silverware",
            'Mode: [select] only\nShould the bot buy "Darkovian Silverware" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CastleUniformsMerge.select,
});

export default function main(): void {
    const script = new CastleUniformsMerge();
    Core.bankingBlackList.push("Cavendish Dusk Crest");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
