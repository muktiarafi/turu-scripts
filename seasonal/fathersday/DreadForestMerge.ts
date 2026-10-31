/*
name: DreadForestMerge
description: null
tags: null
*/
// Port of Scripts/Seasonal/FathersDay/DreadForestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DreadForestMerge {
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
                case "Enchanted Crystal":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(8722);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("dreadforest", "Reignolds' Knight", "Valuable Metals", 8);
                        Core.huntMonster("dreadforest", "Taxidermied Servant", "Gold Pouches", 8);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("dreadforest", "Lord Reignolds", "Reignolds' Brooch", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Blade of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Noble's Knight", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Greatsword of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Treacherous Bandit", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dagger of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Treacherous Bandit", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Daggers of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Treacherous Bandit", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "High Axe of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster(`dreadforest`, "Noble’s Servant", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Greataxe of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8722);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Taxidermied Servant", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Poleaxe of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8722);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Lord Reignolds", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Axes of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8722);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Reignolds' Knight", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Handaxe of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Noble's Knight", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Handaxes of Dread":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("dreadforest", "Noble's Knight", req.name, undefined, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("dreadforest")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("dreadforest", 2140, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("70484", "Runed Knight", 'Mode: [select] only\nShould the bot buy "Runed Knight" ?', false),
        option.bool(
            "70486",
            "Runed Knight's Morph",
            'Mode: [select] only\nShould the bot buy "Runed Knight\'s Morph" ?',
            false,
        ),
        option.bool(
            "70488",
            "Runed Knight's Horned Helm",
            'Mode: [select] only\nShould the bot buy "Runed Knight\'s Horned Helm" ?',
            false,
        ),
        option.bool(
            "70490",
            "Runed Knight's Wings + Cape",
            'Mode: [select] only\nShould the bot buy "Runed Knight\'s Wings + Cape" ?',
            false,
        ),
        option.bool(
            "70491",
            "Runed Knight's Portal Cape",
            'Mode: [select] only\nShould the bot buy "Runed Knight\'s Portal Cape" ?',
            false,
        ),
        option.bool(
            "70507",
            "Enchanted Blade of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Blade of Dread" ?',
            false,
        ),
        option.bool(
            "70508",
            "Enchanted Greatsword of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Greatsword of Dread" ?',
            false,
        ),
        option.bool(
            "70509",
            "Enchanted Dagger of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Dagger of Dread" ?',
            false,
        ),
        option.bool(
            "70510",
            "Enchanted Daggers of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Daggers of Dread" ?',
            false,
        ),
        option.bool(
            "70512",
            "Enchanted High Axe of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted High Axe of Dread" ?',
            false,
        ),
        option.bool(
            "70513",
            "Enchanted Greataxe of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Greataxe of Dread" ?',
            false,
        ),
        option.bool(
            "70514",
            "Enchanted Poleaxe of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Poleaxe of Dread" ?',
            false,
        ),
        option.bool(
            "70517",
            "Enchanted Axe of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Axe of Dread" ?',
            false,
        ),
        option.bool(
            "70518",
            "Enchanted Axes of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Axes of Dread" ?',
            false,
        ),
        option.bool(
            "70519",
            "Enchanted Handaxe of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Handaxe of Dread" ?',
            false,
        ),
        option.bool(
            "70520",
            "Enchanted Handaxes of Dread",
            'Mode: [select] only\nShould the bot buy "Enchanted Handaxes of Dread" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DreadForestMerge.select,
});

export default function main(): void {
    const script = new DreadForestMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
