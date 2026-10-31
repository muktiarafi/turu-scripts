/*
name: ExtinctionGamesMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ExtinctionGamesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ExtinctionGamesMerge {
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
                case "Burningjay Feather":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extinction", "Lard", undefined, undefined, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Coal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extinction", "Cyworg", undefined, undefined, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fabric Scraps":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extinction", "Lard", undefined, undefined, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Iron II.0":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extinction", "Cyworg", undefined, undefined, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "A Kitten?":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extinction", "SN.O.W.", undefined, undefined, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("extinction", 1025, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("26741", "MockingSlay Pet", 'Mode: [select] only\nShould the bot buy "MockingSlay Pet" ?', false),
        option.bool("26738", "MockingHawk Hair", 'Mode: [select] only\nShould the bot buy "MockingHawk Hair" ?', false),
        option.bool(
            "26803",
            "MockingSlayer Bow",
            'Mode: [select] only\nShould the bot buy "MockingSlayer Bow" ?',
            false,
        ),
        option.bool(
            "26733",
            "MockingSlayer Quiver",
            'Mode: [select] only\nShould the bot buy "MockingSlayer Quiver" ?',
            false,
        ),
        option.bool("26731", "Kat Mess Braid", 'Mode: [select] only\nShould the bot buy "Kat Mess Braid" ?', false),
        option.bool(
            "26138",
            "Extinction Survivor Locks",
            'Mode: [select] only\nShould the bot buy "Extinction Survivor Locks" ?',
            false,
        ),
        option.bool(
            "26137",
            "Kale's Pithy Helm",
            'Mode: [select] only\nShould the bot buy "Kale\'s Pithy Helm" ?',
            false,
        ),
        option.bool("26136", "Meeta's Machete", 'Mode: [select] only\nShould the bot buy "Meeta\'s Machete" ?', false),
        option.bool("26135", "Double HAMM Pack", 'Mode: [select] only\nShould the bot buy "Double HAMM Pack" ?', false),
        option.bool(
            "26134",
            "Exctinction Survivor",
            'Mode: [select] only\nShould the bot buy "Exctinction Survivor" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ExtinctionGamesMerge.select,
});

export default function main(): void {
    const script = new ExtinctionGamesMerge();
    Core.bankingBlackList.push("Burningjay Feather", "Coal", "Fabric Scraps", "Iron II.0", "A Kitten? ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
