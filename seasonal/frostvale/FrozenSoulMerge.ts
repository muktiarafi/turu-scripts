/*
name: Frozen Soul Merge
description: This will get all or selected items on this merge shop.
tags: frozen-soul-merge, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/FrozenSoulMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FrozenSoulMerge {
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
                case "Elegant Frostval Wrap":

                case "Hammered Ice":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7262);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("frozensoul", "Frozen Minion", "Shard of Ice", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Frosted Heart":

                case "Cheery Frostvale Hat + Locks":

                case "Cheery Frostvale Hat":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7263);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("frozensoul", "Jack Frost", "Jack's Frosted Heart", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Elegant Frostvale Suit":

                case "Ruby Frostval Cane":

                case "Frozen Soul":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7264);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("frozensoul", "r4", "Left", "*", "Queen's Frozen Soul", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Poleaxe of Kheimon":

                case "Frozen Rune of Kheimon":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("frozensoul", "r4", "Left", "*", req.name, undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("frozensoul", 1815, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "52419",
            "Kheimon's Floating Tome",
            'Mode: [select] only\nShould the bot buy "Kheimon\'s Floating Tome" ?',
            false,
        ),
        option.bool(
            "52420",
            "Bladed Rune of Kheimon",
            'Mode: [select] only\nShould the bot buy "Bladed Rune of Kheimon" ?',
            false,
        ),
        option.bool(
            "52421",
            "Runic Poleaxe of Kheimon",
            'Mode: [select] only\nShould the bot buy "Runic Poleaxe of Kheimon" ?',
            false,
        ),
        option.bool(
            "52422",
            "Hood of the Northlands Monk",
            'Mode: [select] only\nShould the bot buy "Hood of the Northlands Monk" ?',
            false,
        ),
        option.bool("52423", "Northlands Monk", 'Mode: [select] only\nShould the bot buy "Northlands Monk" ?', false),
        option.bool(
            "51680",
            "Elegant Frost Suit",
            'Mode: [select] only\nShould the bot buy "Elegant Frost Suit" ?',
            false,
        ),
        option.bool(
            "51681",
            "Elegant Frost Locks",
            'Mode: [select] only\nShould the bot buy "Elegant Frost Locks" ?',
            false,
        ),
        option.bool(
            "51682",
            "Elegant Frost Topper",
            'Mode: [select] only\nShould the bot buy "Elegant Frost Topper" ?',
            false,
        ),
        option.bool("51683", "Snowmist Wrap", 'Mode: [select] only\nShould the bot buy "Snowmist Wrap" ?', false),
        option.bool(
            "51684",
            "Diamond Frost Cane",
            'Mode: [select] only\nShould the bot buy "Diamond Frost Cane" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FrozenSoulMerge.select,
});

export default function main(): void {
    const script = new FrozenSoulMerge();
    Core.bankingBlackList.push(
        "Hammered Ice",
        "Frosted Heart",
        "Frozen Soul",
        "Frozen Rune of Kheimon",
        "Poleaxe of Kheimon",
        "Elegant Frostvale Suit",
        "Cheery Frostvale Hat + Locks",
        "Elegant Frostval Wrap",
        "Cheery Frostvale Hat",
        "Ruby Frostval Cane",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
