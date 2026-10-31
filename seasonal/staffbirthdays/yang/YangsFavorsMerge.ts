/*
name: Yang's Favors Merge
description: This will complete the Yang's Favors story and farm Yang's Favors Medals.
tags: story, quest, yang, favor, merge, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/Yang/YangsFavorsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class YangsFavorsMerge {
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
                case "Yang's Favor":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9035);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("poisonforest", "Traitor Knight", "Traitor's Medal", 15);
                        Core.huntMonster("poisonforest", "Xavier Lionfang", "Xavier's Medal", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tercessuinotlim", 2217, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70003",
            "BattleMaster Tharr",
            'Mode: [select] only\nShould the bot buy "BattleMaster Tharr" ?',
            false,
        ),
        option.bool(
            "70004",
            "Tharr's Helm + Beard",
            'Mode: [select] only\nShould the bot buy "Tharr\'s Helm + Beard" ?',
            false,
        ),
        option.bool("70005", "Tharr's Helm", 'Mode: [select] only\nShould the bot buy "Tharr\'s Helm" ?', false),
        option.bool("70006", "Tharr's Wrap", 'Mode: [select] only\nShould the bot buy "Tharr\'s Wrap" ?', false),
        option.bool(
            "70007",
            "Tharr's Double-Axe",
            'Mode: [select] only\nShould the bot buy "Tharr\'s Double-Axe" ?',
            false,
        ),
        option.bool(
            "70008",
            "Tharr's Axe and Shield",
            'Mode: [select] only\nShould the bot buy "Tharr\'s Axe and Shield" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YangsFavorsMerge.select,
});

export default function main(): void {
    const script = new YangsFavorsMerge();
    Core.bankingBlackList.push("Yang's Favor");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
