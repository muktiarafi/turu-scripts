/*
name: FiendshardMerge
description: null
tags: null
*/
// Port of Scripts/Nation/MergeShops/FiendshardMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Fiendshard_Story } from "../../story/nation/Fiendshard";

const Adv = new CoreAdvanced();
const Fiendshard = new Fiendshard_Story();

export class FiendshardMerge {
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
                case "Shard of the Shard":
                    Fiendshard.fiendshard_QuestlineP1();
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    //De-shard the Shard 7901
                    Core.registerQuests(7901);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("fiendshard", "r9", "Left", 15, "Piece of the Shard");
                    }
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Void General Surveillance":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("Fiendshard", "Dirtlicker", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fiendshard", 1965, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "58887",
            "Dirt Void of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dirt Void of Nulgath" ?',
            false,
        ),
        option.bool(
            "58888",
            "Dirt Guard of Nulgath",
            'Mode: [select] only\nShould the bot buy "Dirt Guard of Nulgath" ?',
            false,
        ),
        option.bool(
            "58889",
            "Grand Dirt Guard of Nulgath",
            'Mode: [select] only\nShould the bot buy "Grand Dirt Guard of Nulgath" ?',
            false,
        ),
        option.bool(
            "58890",
            "Terran Shard of Nulgath",
            'Mode: [select] only\nShould the bot buy "Terran Shard of Nulgath" ?',
            false,
        ),
        option.bool(
            "58891",
            "Terran Annihilator of Nulgath",
            'Mode: [select] only\nShould the bot buy "Terran Annihilator of Nulgath" ?',
            false,
        ),
        option.bool(
            "58892",
            "Earthsplitter of Nulgath",
            'Mode: [select] only\nShould the bot buy "Earthsplitter of Nulgath" ?',
            false,
        ),
        option.bool(
            "58893",
            "Crystal Void of Nulgath",
            'Mode: [select] only\nShould the bot buy "Crystal Void of Nulgath" ?',
            false,
        ),
        option.bool(
            "58894",
            "Crystal Guard of Nulgath",
            'Mode: [select] only\nShould the bot buy "Crystal Guard of Nulgath" ?',
            false,
        ),
        option.bool(
            "58895",
            "Grand Crystal Guard of Nulgath",
            'Mode: [select] only\nShould the bot buy "Grand Crystal Guard of Nulgath" ?',
            false,
        ),
        option.bool(
            "58896",
            "Crystal Shard of Nulgath",
            'Mode: [select] only\nShould the bot buy "Crystal Shard of Nulgath" ?',
            false,
        ),
        option.bool(
            "58897",
            "Crystal Annihilator of Nulgath",
            'Mode: [select] only\nShould the bot buy "Crystal Annihilator of Nulgath" ?',
            false,
        ),
        option.bool(
            "58898",
            "Crystalsplitter of Nulgath",
            'Mode: [select] only\nShould the bot buy "Crystalsplitter of Nulgath" ?',
            false,
        ),
        option.bool("59144", "Fiendish Gem Pet", 'Mode: [select] only\nShould the bot buy "Fiendish Gem Pet" ?', false),
        option.bool(
            "59140",
            "Void General Oversight",
            'Mode: [select] only\nShould the bot buy "Void General Oversight" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FiendshardMerge.select,
});

export default function main(): void {
    const script = new FiendshardMerge();
    Core.bankingBlackList.push("Shard of the Shard", "Void General Surveillance ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
