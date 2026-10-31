/*
name: EaglesReachArmoryMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/EaglesReachArmoryMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class EaglesReachArmoryMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(): void {
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
                case "Algid Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battlegrounda", "r2", "Left", "*", undefined, undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Frost Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battlegroundb", "r2", "Left", "*", undefined, undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Icy Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battlegroundc", "r2", "Left", "*", undefined, undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Rime Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battlegroundd", "r2", "Left", "*", undefined, undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Gelid Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battlegrounde", "r2", "Left", "*", undefined, undefined, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Glacial Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("battlegroundf", "r2", "Left", "*", undefined, undefined, {
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
        Adv.startBuyAllMerge("battlegrounda", 1062, findIngredients);

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("27724", "Arena Warrior", 'Mode: [select] only\nShould the bot buy "Arena Warrior" ?', false),
        option.bool("27728", "Ice-Ten Mask", 'Mode: [select] only\nShould the bot buy "Ice-Ten Mask" ?', false),
        option.bool(
            "27727",
            "Ice-Ten Mask and Locks",
            'Mode: [select] only\nShould the bot buy "Ice-Ten Mask and Locks" ?',
            false,
        ),
        option.bool(
            "26951",
            "Desolate Duel Axes",
            'Mode: [select] only\nShould the bot buy "Desolate Duel Axes" ?',
            false,
        ),
        option.bool(
            "26947",
            "Desolate ShadowHood Locks",
            'Mode: [select] only\nShould the bot buy "Desolate ShadowHood Locks" ?',
            false,
        ),
        option.bool(
            "26948",
            "Desolate ShadowHood",
            'Mode: [select] only\nShould the bot buy "Desolate ShadowHood" ?',
            false,
        ),
        option.bool(
            "25201",
            "Scarred Sword and Shield",
            'Mode: [select] only\nShould the bot buy "Scarred Sword and Shield" ?',
            false,
        ),
        option.bool(
            "25200",
            "Golden Sword and Shield",
            'Mode: [select] only\nShould the bot buy "Golden Sword and Shield" ?',
            false,
        ),
        option.bool("26944", "Desolate Rogue", 'Mode: [select] only\nShould the bot buy "Desolate Rogue" ?', false),
        option.bool(
            "26945",
            "Hood of the Desolate Locks",
            'Mode: [select] only\nShould the bot buy "Hood of the Desolate Locks" ?',
            false,
        ),
        option.bool(
            "26946",
            "Hood of the Desolate",
            'Mode: [select] only\nShould the bot buy "Hood of the Desolate" ?',
            false,
        ),
        option.bool("26950", "Desolate Mask", 'Mode: [select] only\nShould the bot buy "Desolate Mask" ?', false),
        option.bool("26952", "Fallen Cape", 'Mode: [select] only\nShould the bot buy "Fallen Cape" ?', false),
        option.bool(
            "25764",
            "Blade of Ancient Evil",
            'Mode: [select] only\nShould the bot buy "Blade of Ancient Evil" ?',
            false,
        ),
        option.bool(
            "25765",
            "Sheathed Blade of Evil",
            'Mode: [select] only\nShould the bot buy "Sheathed Blade of Evil" ?',
            false,
        ),
        option.bool(
            "25766",
            "Ancient Crossed Katana",
            'Mode: [select] only\nShould the bot buy "Ancient Crossed Katana" ?',
            false,
        ),
        option.bool(
            "25767",
            "Mask of Ancient Evil",
            'Mode: [select] only\nShould the bot buy "Mask of Ancient Evil" ?',
            false,
        ),
        option.bool(
            "25768",
            "Locks of Ancient Evil",
            'Mode: [select] only\nShould the bot buy "Locks of Ancient Evil" ?',
            false,
        ),
        option.bool(
            "25762",
            "Ancient Evil Commander",
            'Mode: [select] only\nShould the bot buy "Ancient Evil Commander" ?',
            false,
        ),
        option.bool("25189", "Hyaline Spear", 'Mode: [select] only\nShould the bot buy "Hyaline Spear" ?', false),
        option.bool("25190", "Sheer Polearm", 'Mode: [select] only\nShould the bot buy "Sheer Polearm" ?', false),
        option.bool("25191", "Translucent Axe", 'Mode: [select] only\nShould the bot buy "Translucent Axe" ?', false),
        option.bool(
            "27729",
            "Golden Staff Of Healing",
            'Mode: [select] only\nShould the bot buy "Golden Staff Of Healing" ?',
            false,
        ),
        option.bool("27731", "Bronze Barbarian", 'Mode: [select] only\nShould the bot buy "Bronze Barbarian" ?', false),
        option.bool(
            "27725",
            "Gladiator Warrior",
            'Mode: [select] only\nShould the bot buy "Gladiator Warrior" ?',
            false,
        ),
        option.bool("27730", "Gilded Gladiator", 'Mode: [select] only\nShould the bot buy "Gilded Gladiator" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EaglesReachArmoryMerge.select,
});

export default function main(): void {
    const script = new EaglesReachArmoryMerge();
    Core.bankingBlackList.push(
        "Algid Token",
        "Frost Token",
        "Icy Token",
        "Rime Token",
        "Gelid Token",
        "Glacial Token ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
