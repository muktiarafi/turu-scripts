/*
name: Loughshine Loot Merge
description: This bot will farm the items belonging to the selected mode for the Loughshine Loot Merge [2452] in /loughshine
tags: loughshine, loot, merge, loughshine, gold, voucher, k, skye, executor, backhanded, speirling, warden, west, wardens, cowled, guardian
*/
// Port of Scripts/Other/MergeShops/LoughshineLootMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class LoughshineLootMerge {
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
                case "Salvaged Skye Armament":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("castleeblana", "Skye Warrior", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Speirling Dagger":

                case "Speirling Daggers":

                case "Skye Executor Hooded Locks":

                case "Skye Executor's Cloak":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("loughshine", "Skye Executor", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Solid Gold Alloy":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9765);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("loughshine", "Scorched Elder Yew", "Yew Root", 100, { log: false });
                        Core.huntMonster("loughshine", "Energy Elemental", "Ion Particles", 60, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("loughshine", "Warden Iseul", "Gold Pendant", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        AOR.loughshine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("loughshine", 2452, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("86037", "Skye Executor", 'Mode: [select] only\nShould the bot buy "Skye Executor" ?', false),
        option.bool(
            "86038",
            "Skye Executor Hooded Visage",
            'Mode: [select] only\nShould the bot buy "Skye Executor Hooded Visage" ?',
            false,
        ),
        option.bool(
            "86039",
            "Skye Executor Hood",
            'Mode: [select] only\nShould the bot buy "Skye Executor Hood" ?',
            false,
        ),
        option.bool(
            "86044",
            "Backhanded Speirling Dagger",
            'Mode: [select] only\nShould the bot buy "Backhanded Speirling Dagger" ?',
            false,
        ),
        option.bool(
            "86045",
            "Backhanded Speirling Daggers",
            'Mode: [select] only\nShould the bot buy "Backhanded Speirling Daggers" ?',
            false,
        ),
        option.bool(
            "86046",
            "Skye Warden of the West",
            'Mode: [select] only\nShould the bot buy "Skye Warden of the West" ?',
            false,
        ),
        option.bool(
            "86047",
            "Skye Warden's Cowled Visage",
            'Mode: [select] only\nShould the bot buy "Skye Warden\'s Cowled Visage" ?',
            false,
        ),
        option.bool(
            "86048",
            "Skye Warden's Cowled Mask",
            'Mode: [select] only\nShould the bot buy "Skye Warden\'s Cowled Mask" ?',
            false,
        ),
        option.bool(
            "86049",
            "Skye Warden's Cowled Locks",
            'Mode: [select] only\nShould the bot buy "Skye Warden\'s Cowled Locks" ?',
            false,
        ),
        option.bool(
            "86050",
            "Skye Warden of the West Cape",
            'Mode: [select] only\nShould the bot buy "Skye Warden of the West Cape" ?',
            false,
        ),
        option.bool(
            "86051",
            "Speirling Guardian Dagger",
            'Mode: [select] only\nShould the bot buy "Speirling Guardian Dagger" ?',
            false,
        ),
        option.bool(
            "86052",
            "Speirling Guardian Daggers",
            'Mode: [select] only\nShould the bot buy "Speirling Guardian Daggers" ?',
            false,
        ),
        option.bool(
            "86053",
            "Backhanded Speirling Guardian Dagger",
            'Mode: [select] only\nShould the bot buy "Backhanded Speirling Guardian Dagger" ?',
            false,
        ),
        option.bool(
            "86054",
            "Backhanded Speirling Guardian Daggers",
            'Mode: [select] only\nShould the bot buy "Backhanded Speirling Guardian Daggers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LoughshineLootMerge.select,
});

export default function main(): void {
    const script = new LoughshineLootMerge();
    Core.bankingBlackList.push(
        "Salvaged Skye Armament",
        "Speirling Dagger",
        "Speirling Daggers",
        "Solid Gold Alloy",
        "Skye Executor Hooded Locks",
        "Skye Executor's Cloak",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
