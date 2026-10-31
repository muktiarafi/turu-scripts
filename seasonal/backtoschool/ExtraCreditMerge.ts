/*
name: Extra Credit Merge
description: This bot will farm the items belonging to the selected mode for the Extra Credit Merge [2158] in /extracredit
tags: extra, credit, merge, extracredit, ultra, fierce, outfit, super, cute, academic, attitude, curls, power, puffs, female, morph, becky, ben, beckys, bens, academy, jacket, jeans, autumn, days, violet, puffed, coat, grape, chill, package, fiercer, chewy, cookie, melty, crunchy, gourmet, amethyst, akibakei, headset, wings, havoc, hammer, hammers, crystallis, gymwear, trainer
*/
// Port of Scripts/Seasonal/BackToSchool/ExtraCreditMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ExtraCreditMerge {
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
                case "Golden Apple":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8793);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extracredit", "Dogear", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Silver Ruler":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8790);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extracredit", "Supply Locker", "Bookbag", undefined, { log: false });
                        Core.huntMonster("extracredit", "Supply Locker", "Pencil", 3, { log: false });
                        Core.huntMonster("extracredit", "Supply Locker", "Notebook", 3, { log: false });
                        Core.huntMonster("extracredit", "Grade A Bully", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Plastic Toy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8791);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extracredit", "Grade A Bully", "Bully Defeated", 5, { log: false });
                        Core.huntMonster("extracredit", "Meanest Girl", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bronze Plaque":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8792);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extracredit", "Videogame Console", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Guava Sip":

                case "Purple Paddlepop":

                case "Crystallis Trainer Locks":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("extracredit", "Meanest Girl", req.name, quant, { isTemp: false, log: false });
                    break;
                case "DogEar's Snack Serum":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("extracredit", "Dogear", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Raw Cookie Dough Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.getMapItem(11646, quant, "oaklore");
                    break;
                case "Crystallis Trainer Hair":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("extracredit", "Grade A Bully", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("extracredit")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("extracredit", 2158, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "61620",
            "Ultra Fierce Outfit",
            'Mode: [select] only\nShould the bot buy "Ultra Fierce Outfit" ?',
            false,
        ),
        option.bool("61622", "Super Cute Hair", 'Mode: [select] only\nShould the bot buy "Super Cute Hair" ?', false),
        option.bool(
            "61627",
            "Ultra Fierce Locks",
            'Mode: [select] only\nShould the bot buy "Ultra Fierce Locks" ?',
            false,
        ),
        option.bool(
            "61629",
            "Academic Attitude",
            'Mode: [select] only\nShould the bot buy "Academic Attitude" ?',
            false,
        ),
        option.bool("61630", "Curls of Power", 'Mode: [select] only\nShould the bot buy "Curls of Power" ?', false),
        option.bool(
            "61631",
            "Power Puffs Locks",
            'Mode: [select] only\nShould the bot buy "Power Puffs Locks" ?',
            false,
        ),
        option.bool(
            "61632",
            "Power Puffs Female Morph",
            'Mode: [select] only\nShould the bot buy "Power Puffs Female Morph" ?',
            false,
        ),
        option.bool(
            "61633",
            "Curls of Power Morph",
            'Mode: [select] only\nShould the bot buy "Curls of Power Morph" ?',
            false,
        ),
        option.bool("61634", "Becky", 'Mode: [select] only\nShould the bot buy "Becky" ?', false),
        option.bool("61635", "Ben", 'Mode: [select] only\nShould the bot buy "Ben" ?', false),
        option.bool("61636", "Becky's Morph", 'Mode: [select] only\nShould the bot buy "Becky\'s Morph" ?', false),
        option.bool("61637", "Ben's Morph", 'Mode: [select] only\nShould the bot buy "Ben\'s Morph" ?', false),
        option.bool(
            "61882",
            "Academy Jacket Outfit",
            'Mode: [select] only\nShould the bot buy "Academy Jacket Outfit" ?',
            false,
        ),
        option.bool(
            "61884",
            "Academy Jeans Outfit",
            'Mode: [select] only\nShould the bot buy "Academy Jeans Outfit" ?',
            false,
        ),
        option.bool(
            "62185",
            "Autumn Days Outfit",
            'Mode: [select] only\nShould the bot buy "Autumn Days Outfit" ?',
            false,
        ),
        option.bool("62186", "Autumn Days Hat", 'Mode: [select] only\nShould the bot buy "Autumn Days Hat" ?', false),
        option.bool(
            "62187",
            "Autumn Days Hat and Locks",
            'Mode: [select] only\nShould the bot buy "Autumn Days Hat and Locks" ?',
            false,
        ),
        option.bool(
            "79458",
            "Violet Puffed Coat",
            'Mode: [select] only\nShould the bot buy "Violet Puffed Coat" ?',
            false,
        ),
        option.bool(
            "79461",
            "Grape Chill Package",
            'Mode: [select] only\nShould the bot buy "Grape Chill Package" ?',
            false,
        ),
        option.bool(
            "71688",
            "Ultra Fiercer Outfit",
            'Mode: [select] only\nShould the bot buy "Ultra Fiercer Outfit" ?',
            false,
        ),
        option.bool(
            "28001",
            "Chewy Cookie Sword",
            'Mode: [select] only\nShould the bot buy "Chewy Cookie Sword" ?',
            false,
        ),
        option.bool(
            "28002",
            "Melty Cookie Sword",
            'Mode: [select] only\nShould the bot buy "Melty Cookie Sword" ?',
            false,
        ),
        option.bool(
            "28003",
            "Crunchy Cookie Sword",
            'Mode: [select] only\nShould the bot buy "Crunchy Cookie Sword" ?',
            false,
        ),
        option.bool(
            "28004",
            "Gourmet Cookie Sword",
            'Mode: [select] only\nShould the bot buy "Gourmet Cookie Sword" ?',
            false,
        ),
        option.bool(
            "86980",
            "Amethyst Akiba-kei Outfit",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Outfit" ?',
            false,
        ),
        option.bool(
            "86985",
            "Amethyst Akiba-kei Headset Hair",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Headset Hair" ?',
            false,
        ),
        option.bool(
            "86986",
            "Amethyst Akiba-kei Headset Locks",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Headset Locks" ?',
            false,
        ),
        option.bool(
            "86987",
            "Amethyst Akiba-kei Morph",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Morph" ?',
            false,
        ),
        option.bool(
            "86988",
            "Amethyst Akiba-kei Visage",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Visage" ?',
            false,
        ),
        option.bool(
            "86991",
            "Amethyst Akiba-kei Headset Morph",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Headset Morph" ?',
            false,
        ),
        option.bool(
            "86992",
            "Amethyst Akiba-kei Headset Visage",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Headset Visage" ?',
            false,
        ),
        option.bool(
            "86994",
            "Amethyst Akiba-kei Aura Wings",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Aura Wings" ?',
            false,
        ),
        option.bool(
            "87000",
            "Amethyst Akiba-kei Havoc Hammer",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Havoc Hammer" ?',
            false,
        ),
        option.bool(
            "87001",
            "Amethyst Akiba-kei Havoc Hammers",
            'Mode: [select] only\nShould the bot buy "Amethyst Akiba-kei Havoc Hammers" ?',
            false,
        ),
        option.bool(
            "83700",
            "Crystallis Gymwear",
            'Mode: [select] only\nShould the bot buy "Crystallis Gymwear" ?',
            false,
        ),
        option.bool(
            "83703",
            "Crystallis Trainer Morph",
            'Mode: [select] only\nShould the bot buy "Crystallis Trainer Morph" ?',
            false,
        ),
        option.bool(
            "83704",
            "Crystallis Trainer Visage",
            'Mode: [select] only\nShould the bot buy "Crystallis Trainer Visage" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ExtraCreditMerge.select,
});

export default function main(): void {
    const script = new ExtraCreditMerge();
    Core.bankingBlackList.push(
        "Golden Apple",
        "Silver Ruler",
        "Plastic Toy",
        "Bronze Plaque",
        "Guava Sip",
        "Purple Paddlepop",
        "DogEar's Snack Serum",
        "Raw Cookie Dough Blade",
        "Crystallis Trainer Hair",
        "Crystallis Trainer Locks",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
