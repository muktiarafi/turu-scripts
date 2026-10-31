/*
name: TachyonMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/TachyonMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const Adv = new CoreAdvanced();
const TOD = new CoreToD();

export class TachyonMerge {
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
                case "Blue Overdrive":

                case "Blue Powercell":

                case "Blue Tachyon Trigger":

                case "Blue Tachyon Grip":
                    if (!Core.checkInventory("Orange Tachyon Blade")) {
                        this.buyAllMerge("Orange Tachyon Blade");
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5084);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("tachyon", "Svelgr the Devourer", "Svelgr the Devourer Defeated", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Tachyon Core Piece":

                case "Orange Overdrive":

                case "Orange Tachyon Grip":

                case "Orange Tachyon Trigger":

                case "Orange Powercell":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5083);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("tachyon", "Svelgr the Devourer", "Svelgr the Devourer Defeated", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Saeculum Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5085);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("tachyon", "Svelgr the Devourer", "Svelgr Fang", undefined, { isTemp: false });
                        Core.huntMonster("portalwar", "Chronorysa", "Sands of Time", 6, { isTemp: false });
                        Core.huntMonster("portalmaze", "Time Wraith", "Wraith Wisp", 12, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isMember) {
            Core.logger("This Merge Requires Membership.");
            return;
        }

        TOD.deepSpace();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tachyon", 1251, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34915",
            "Blue Tachyon Blade",
            'Mode: [select] only\nShould the bot buy "Blue Tachyon Blade" ?',
            false,
        ),
        option.bool(
            "34916",
            "Orange Tachyon Blade",
            'Mode: [select] only\nShould the bot buy "Orange Tachyon Blade" ?',
            false,
        ),
        option.bool("34737", "Chrono Assassin", 'Mode: [select] only\nShould the bot buy "Chrono Assassin" ?', false),
        option.bool(
            "35096",
            "Chrono Assassin Armor",
            'Mode: [select] only\nShould the bot buy "Chrono Assassin Armor" ?',
            false,
        ),
        option.bool("34817", "Time Assassin", 'Mode: [select] only\nShould the bot buy "Time Assassin" ?', false),
        option.bool(
            "34818",
            "Time Assassin Cowl",
            'Mode: [select] only\nShould the bot buy "Time Assassin Cowl" ?',
            false,
        ),
        option.bool("34819", "Time Slicer", 'Mode: [select] only\nShould the bot buy "Time Slicer" ?', false),
        option.bool(
            "34820",
            "Ruins of Time Cape",
            'Mode: [select] only\nShould the bot buy "Ruins of Time Cape" ?',
            false,
        ),
        option.bool(
            "35140",
            "Dual Tachyon Blades",
            'Mode: [select] only\nShould the bot buy "Dual Tachyon Blades" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TachyonMerge.select,
});

export default function main(): void {
    const script = new TachyonMerge();
    Core.bankingBlackList.push(
        "Tachyon Core Piece",
        "Blue Powercell",
        "Blue Overdrive",
        "Blue Tachyon Grip",
        "Blue Tachyon Trigger",
        "Orange Powercell",
        "Orange Overdrive",
        "Orange Tachyon Grip",
        "Orange Tachyon Trigger",
        "Saeculum Gem ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
