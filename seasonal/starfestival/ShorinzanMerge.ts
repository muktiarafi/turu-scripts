/*
name: Shorinzan Merge
description: This bot will farm the items belonging to the selected mode for the Shorinzan Merge [2148] in /starfest
tags: shorinzan, merge, starfest, starry, samurai, samurais, backswords, aurelian, aurous, hope, fallen, stars, dark, heart, hearts, blackhole, suns
*/
// Port of Scripts/Seasonal/StarFestival/ShorinzanMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ShorinzanMerge {
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
                case "Deepest Desire":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8753);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("Tercessuinotlim", "Tainted Elemental", "Tainted Essence Collected", 10);
                        Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Makai Essence Collected", 20);
                        Core.huntMonster("necrodungeon", "SlimeSkull", "Necropolis Soul Collected", 15);
                        Core.equipClass(ClassType.Solo);
                        Core.killMonster("necrodungeon", "r22", "Down", "*", "Dracolich Soul Collected", 15);
                        Core.huntMonster("necrodungeon", "Doom Overlord", "Doom Power Catalyst", 2);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Hidden Hope":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8751);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster(`battleunderb`, "Enter", "Spawn", "*", "Bundle O' Bones", 30);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonsterMapID(`Odokuro`, 1, "Odokuro's Occipital");
                        Core.huntMonster(`bonecastle`, "Vaden", "Vaden's Other Arm");
                        Core.huntMonster(`vordredboss`, "Vordred", "Vordred's Skull(s)", 3);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Simple Wish":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8748);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        if (!Core.checkInventory("Twilly Twig")) {
                            Core.addDrop("Twilly Twig");
                            Core.ensureAccept(11);
                            Core.huntMonster("farm", "Treeant", "Treeant Branch");
                            Core.ensureComplete(11);
                            bot.wait.forPickup("Twilly Twig");
                        }
                        Core.huntMonster("brightoak", "Bright Treeant", "Brightest Branch", 6);
                        Core.huntMonster("farm", "Treeant", "Treant Leaf");
                        Core.huntMonster("guardiantree", "Blossoming Treeant", "Beautiful Blossom", 6);
                        Core.huntMonster("NibbleOn", "Mean Old Treeant", "Bitter Bark", 8);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fallen Star Shard":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("starfest", "Fallen Star", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Hashihime's Heart":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("yokaistarriver", "Uji No Hashihime", req.name, quant, { isTemp: false });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("yokairiver")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("starfest", 2148, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("71290", "Starry Samurai", 'Mode: [select] only\nShould the bot buy "Starry Samurai" ?', false),
        option.bool(
            "71291",
            "Starry Samurai's Mask",
            'Mode: [select] only\nShould the bot buy "Starry Samurai\'s Mask" ?',
            false,
        ),
        option.bool(
            "71292",
            "Starry Samurai's BackSwords",
            'Mode: [select] only\nShould the bot buy "Starry Samurai\'s BackSwords" ?',
            false,
        ),
        option.bool(
            "71293",
            "Starry Samurai's Sword",
            'Mode: [select] only\nShould the bot buy "Starry Samurai\'s Sword" ?',
            false,
        ),
        option.bool(
            "71294",
            "Starry Samurai's Swords",
            'Mode: [select] only\nShould the bot buy "Starry Samurai\'s Swords" ?',
            false,
        ),
        option.bool("69473", "Aurelian Sword", 'Mode: [select] only\nShould the bot buy "Aurelian Sword" ?', false),
        option.bool("69474", "Aurelian Swords", 'Mode: [select] only\nShould the bot buy "Aurelian Swords" ?', false),
        option.bool(
            "69479",
            "Aurous Staff of Hope",
            'Mode: [select] only\nShould the bot buy "Aurous Staff of Hope" ?',
            false,
        ),
        option.bool(
            "78064",
            "Fallen Star's Dark Heart",
            'Mode: [select] only\nShould the bot buy "Fallen Star\'s Dark Heart" ?',
            false,
        ),
        option.bool(
            "78065",
            "Fallen Star's Dark Hearts",
            'Mode: [select] only\nShould the bot buy "Fallen Star\'s Dark Hearts" ?',
            false,
        ),
        option.bool(
            "78074",
            "Blackhole Sun's Heart",
            'Mode: [select] only\nShould the bot buy "Blackhole Sun\'s Heart" ?',
            false,
        ),
        option.bool(
            "78075",
            "Blackhole Sun's Hearts",
            'Mode: [select] only\nShould the bot buy "Blackhole Sun\'s Hearts" ?',
            false,
        ),
        option.bool(
            "78801",
            "Blackhole Sun's Heart",
            'Mode: [select] only\nShould the bot buy "Blackhole Sun\'s Heart" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShorinzanMerge.select,
});

export default function main(): void {
    const script = new ShorinzanMerge();
    Core.bankingBlackList.push(
        "Deepest Desire",
        "Hidden Hope",
        "Simple Wish",
        "Fallen Star Shard",
        "Hashihime's Heart",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
