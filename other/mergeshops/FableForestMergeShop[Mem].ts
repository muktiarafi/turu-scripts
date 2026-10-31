/*
name: Fable Forest Merge
description: This bot will farm the items belonging to the selected mode for the Fable Forest Merge [815] in /fableforest
tags: fable, forest, merge, fableforest, wind, dragon, tail, oakheart, back, shield, magic, armblades, guardian, not, quite, chaos, shape, shadowscythe, morph, ultra, hydra, dreadspider, combo, dwakel, tech, fire, water, nature, prismatic, faerie, botanis, elements
*/
// Port of Scripts/Other/MergeShops/FableForestMergeShop[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class FableForestMerge {
    // [Can Change] This should only be changed by the author.
    //If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Wind Stone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(3316);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fableforest", "Wind Elemental", "Wind Aura", 5);
                        Core.huntMonster("fableforest", "Forest Fury", "Forest Fury Feather", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Earth Stone":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(3317);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fableforest", "Earth Elemental", "Earth Aura", 5, { log: false });
                        Core.huntMonster("fableforest", "Undead Satyr", "Satyr Hoof", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fire Stone":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(3314);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fableforest", "Fire Elemental", "Fire Aura", 5);
                        Core.huntMonster("fableforest", "Bloodwolf", "Bloodwolf Pelt", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Water Stone":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(3315);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fableforest", "Water Elemental", "Water Aura", 5);
                        Core.huntMonster("fableforest", "Aqueevil", "Aqueevil Spirit", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Chaos Stone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(3318);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("fableforest", "Forest Guardian", "Chaos Aura");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Plain Dragon Tail":

                case "OakHeart Helm":

                case "OakHeart ArmBlades":

                case "Not Quite Dread Mask":

                case "Not Quite Dread Shape":

                case "Hydra Cape":

                case "Dreadspider Cape":

                case "Dreadspider Abdomen":

                case "Red Dragon Morph":

                case "Faerie Botanis Sword":
                    Adv.buyItem("fableforest", 814, req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fableforest", 815, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("22324", "Wind Dragon Tail", 'Mode: [select] only\nShould the bot buy "Wind Dragon Tail" ?', false),
        option.bool(
            "22274",
            "OakHeart Back Shield",
            'Mode: [select] only\nShould the bot buy "OakHeart Back Shield" ?',
            false,
        ),
        option.bool(
            "22273",
            "OakHeart Magic Helm",
            'Mode: [select] only\nShould the bot buy "OakHeart Magic Helm" ?',
            false,
        ),
        option.bool(
            "22271",
            "OakHeart Magic ArmBlades",
            'Mode: [select] only\nShould the bot buy "OakHeart Magic ArmBlades" ?',
            false,
        ),
        option.bool(
            "22269",
            "OakHeart Guardian",
            'Mode: [select] only\nShould the bot buy "OakHeart Guardian" ?',
            false,
        ),
        option.bool(
            "22254",
            "Not Quite Chaos Mask",
            'Mode: [select] only\nShould the bot buy "Not Quite Chaos Mask" ?',
            false,
        ),
        option.bool(
            "22253",
            "Not Quite Chaos Shape",
            'Mode: [select] only\nShould the bot buy "Not Quite Chaos Shape" ?',
            false,
        ),
        option.bool(
            "22237",
            "Chaos Shadowscythe Morph",
            'Mode: [select] only\nShould the bot buy "Chaos Shadowscythe Morph" ?',
            false,
        ),
        option.bool("22233", "Ultra Hydra Cape", 'Mode: [select] only\nShould the bot buy "Ultra Hydra Cape" ?', false),
        option.bool(
            "22230",
            "Dreadspider Combo",
            'Mode: [select] only\nShould the bot buy "Dreadspider Combo" ?',
            false,
        ),
        option.bool(
            "22222",
            "Dwakel Tech Spikes",
            'Mode: [select] only\nShould the bot buy "Dwakel Tech Spikes" ?',
            false,
        ),
        option.bool("22221", "Fire Dragon Tail", 'Mode: [select] only\nShould the bot buy "Fire Dragon Tail" ?', false),
        option.bool(
            "22220",
            "Water Dragon Tail",
            'Mode: [select] only\nShould the bot buy "Water Dragon Tail" ?',
            false,
        ),
        option.bool(
            "22219",
            "Nature Dragon Tail",
            'Mode: [select] only\nShould the bot buy "Nature Dragon Tail" ?',
            false,
        ),
        option.bool(
            "22210",
            "Prismatic Dragon Morph",
            'Mode: [select] only\nShould the bot buy "Prismatic Dragon Morph" ?',
            false,
        ),
        option.bool(
            "22154",
            "Faerie Botanis Staff",
            'Mode: [select] only\nShould the bot buy "Faerie Botanis Staff" ?',
            false,
        ),
        option.bool(
            "43451",
            "FableForest Elements Cape",
            'Mode: [select] only\nShould the bot buy "FableForest Elements Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FableForestMerge.select,
});

export default function main(): void {
    const script = new FableForestMerge();
    Core.bankingBlackList.push(
        "Plain Dragon Tail",
        "Wind Stone",
        "Earth Stone",
        "OakHeart Helm",
        "Fire Stone",
        "Water Stone",
        "OakHeart ArmBlades",
        "Chaos Stone",
        "Not Quite Dread Mask",
        "Not Quite Dread Shape",
        "Hydra Cape",
        "Dreadspider Cape",
        "Dreadspider Abdomen",
        "Red Dragon Morph",
        "Faerie Botanis Sword",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
