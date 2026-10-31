/*
name: Obsessor Commander Merge
description: This bot will farm the items belonging to the selected mode for the Obsessor Commander Merge [2486] in /shadowrealm
tags: taka, obsessor, commander, merge, shadowrealm, captain, cap, skull, obsessors, shadow, compass, rose, pet, cutlass, cutlasses, skulls
*/
// Port of Scripts/Other/MergeShops/ObsessorCommanderMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Adv = new CoreAdvanced();
const Daily = new CoreDailies();

export class ObsessorCommanderMerge {
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
                case "Elden Ruby":
                    Core.farmingLogger(req.name, quant);
                    Daily.eldenRuby(quant);
                    break;
                case "Compass Rose Skull":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(
                            9894,
                            ["dracocon", "Treasure Pile", ClassType.Farm],
                            ["battleundere", "Treasure Pile", ClassType.Farm],
                            ["greed", "Treasure Pile", ClassType.Farm],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowrealm", 2486, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "88373",
            "Obsessor Commander",
            'Mode: [select] only\nShould the bot buy "Obsessor Commander" ?',
            false,
        ),
        option.bool(
            "88375",
            "Obsessor Captain Hat",
            'Mode: [select] only\nShould the bot buy "Obsessor Captain Hat" ?',
            false,
        ),
        option.bool(
            "88376",
            "Obsessor Captain Cap",
            'Mode: [select] only\nShould the bot buy "Obsessor Captain Cap" ?',
            false,
        ),
        option.bool(
            "88377",
            "Obsessor Captain Skull Hat",
            'Mode: [select] only\nShould the bot buy "Obsessor Captain Skull Hat" ?',
            false,
        ),
        option.bool(
            "88379",
            "Obsessor's Shadow",
            'Mode: [select] only\nShould the bot buy "Obsessor\'s Shadow" ?',
            false,
        ),
        option.bool(
            "88380",
            "Compass Rose Skull Pet",
            'Mode: [select] only\nShould the bot buy "Compass Rose Skull Pet" ?',
            false,
        ),
        option.bool("88381", "Obsessor Cutlass", 'Mode: [select] only\nShould the bot buy "Obsessor Cutlass" ?', false),
        option.bool(
            "88382",
            "Obsessor Cutlasses",
            'Mode: [select] only\nShould the bot buy "Obsessor Cutlasses" ?',
            false,
        ),
        option.bool(
            "88384",
            "Compass Rose Skulls",
            'Mode: [select] only\nShould the bot buy "Compass Rose Skulls" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ObsessorCommanderMerge.select,
});

export default function main(): void {
    const script = new ObsessorCommanderMerge();
    Core.bankingBlackList.push("Elden Ruby", "Compass Rose Skull");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
