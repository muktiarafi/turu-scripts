/*
name: Pirate Plunder Merge
description: Farms the Pirate Plunder Merge [2621] in /piratehunt.
tags: piratehunt, merge, pirate, plunder, merge
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/PirateHuntMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { PirateClass } from "../PirateClass";

const Adv = new CoreAdvanced();
const Pirate = new PirateClass();

export class PiratePlunder {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Belladonna's Flag":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10390);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("piratehunt", "Captain Bellamy", "Bellamy's Greasy Beard", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bourgeois' Flag":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10392);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("piratehunt", "Captain Verich", "Captain Verich's Tricorn", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Cutlass of Awe":
                    // #FROM CASE STORAGE
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop("Cutlass of Awe");
                    while (!bot.shouldExit && !Core.checkInventory("Cutlass of Awe", quant)) {
                        if (!Core.isCompletedBefore(10388) && !Core.checkInventory("Cutlass of Awe")) {
                            Core.ensureAccept(10388);
                        }

                        if (!Core.checkInventory("Cutlass of Awe Handle")) {
                            Core.killMonster(
                                "seakingkurok",
                                "r2",
                                "Left",
                                "Sea King Gravefang",
                                "Cutlass of Awe Handle",
                                1,
                                { isTemp: false },
                            );
                        }

                        if (!Core.checkInventory("Cutlass of Awe Hilt")) {
                            Core.killMonster(
                                "dragoncapital",
                                "r8",
                                "Left",
                                "Empowered Scalebeard",
                                "Cutlass of Awe Hilt",
                                1,
                                { isTemp: false },
                            );
                        }

                        if (!Core.checkInventory("Cutlass of Awe Blade")) {
                            Core.killMonster("kaijuwar", "r9", "Left", "Captain Kraylox", "Cutlass of Awe Blade", 1, {
                                isTemp: false,
                            });
                        }

                        if (!Core.checkInventory("Awe Binding Spell")) {
                            Core.killMonster("blazingbeach", "r8", "Left", "Magma Blazebeard", "Awe Binding Spell", 1, {
                                isTemp: false,
                            });
                        }

                        if (
                            Core.checkInventory("Cutlass of Awe Handle") &&
                            Core.checkInventory("Cutlass of Awe Hilt") &&
                            Core.checkInventory("Cutlass of Awe Blade") &&
                            Core.checkInventory("Awe Binding Spell")
                        ) {
                            Core.ensureComplete(10388);
                            bot.wait.forPickup("Cutlass of Awe");
                        }
                    }
                    break;
                case "Eyepatch":
                    // #FROM CASE STORAGE
                    if (!Core.checkInventory([22, 252, 31176], undefined, { any: true })) {
                        Core.logger(`Pirate class required to buy ${req.name}, we'll aquire it for you.`);
                        Pirate.getPirate();
                    }
                    Adv.buyItem("pirates", 9, req.name);
                    bot.wait.forPickup(req.id);
                    break;
                case "First Gold Rapier":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("piratehunt", "Captain Haines", req.name, quant, { isTemp: req.temp });
                    break;
                case "J6's Secret Hideout Map":
                    // #FROM CASE STORAGE
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.name);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("j6", "Sketchy Dragon", req.name, quant, { isTemp: false });
                    }
                    break;
                case "Mercurius' Flag":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10398);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("piratehunt", "Captain Mercurius", "Mercurius' Funny Hat", 1);
                        Core.huntMonster("piratehunt", "Dragonsworn Larunda", "Larunda's Counterfeit Amulet", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Merry Celeste's Flag":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10396);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("piratehunt", "Captain Haines", "Captain Haines' Soul", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Novac Sal Eyepatch Morph":

                case "Novac Sal Eyepatch Visage":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("piratehunt", "Captain Bellamy", req.name, quant, { isTemp: req.temp });
                    break;
                case "Novac Sal Morph":

                case "Novac Sal Visage":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("piratehunt", "Captain Verich", req.name, quant, { isTemp: req.temp });
                    break;
                case "Pirated Tech's Flag":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10394);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("piratehunt", "Captain Chamfer", "Captain Chamfer's Mods", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                default: {
                    const shouldStop = !Adv.matsOnly || !this.dontStopMissingIng;
                    Core.logger(`The bot hasn't been taught how to get ${req.name}.`, undefined, {
                        messageBox: shouldStop,
                        stopBot: shouldStop,
                    });
                    break;
                }
            }
        };
        Adv.startBuyAllMerge("piratehunt", 2621, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool("94712", "Novac Sal Pirate", 'Mode: [select] only\nShould the bot buy "Novac Sal Pirate" ?', false),
        option.bool(
            "94713",
            "Novac Sal Privateer",
            'Mode: [select] only\nShould the bot buy "Novac Sal Privateer" ?',
            false,
        ),
        option.bool(
            "95375",
            "First Mate o' Awe",
            'Mode: [select] only\nShould the bot buy "First Mate o\' Awe" ?',
            false,
        ),
        option.bool(
            "95382",
            "Sheathed Rapier of Awe",
            'Mode: [select] only\nShould the bot buy "Sheathed Rapier of Awe" ?',
            false,
        ),
        option.bool(
            "95386",
            "Dual Cutlass of Awe",
            'Mode: [select] only\nShould the bot buy "Dual Cutlass of Awe" ?',
            false,
        ),
        option.bool(
            "94724",
            "First Gold Cutlasses",
            'Mode: [select] only\nShould the bot buy "First Gold Cutlasses" ?',
            false,
        ),
        option.bool(
            "94727",
            "Pirate's First Gold",
            'Mode: [select] only\nShould the bot buy "Pirate\'s First Gold" ?',
            false,
        ),
        option.bool("95388", "Rapiers of Awe", 'Mode: [select] only\nShould the bot buy "Rapiers of Awe" ?', false),
        option.bool(
            "94716",
            "Novac Sal Crew Morph",
            'Mode: [select] only\nShould the bot buy "Novac Sal Crew Morph" ?',
            false,
        ),
        option.bool(
            "94717",
            "Novac Sal Crew Visage",
            'Mode: [select] only\nShould the bot buy "Novac Sal Crew Visage" ?',
            false,
        ),
        option.bool(
            "95376",
            "Captain o' Awe Cap",
            'Mode: [select] only\nShould the bot buy "Captain o\' Awe Cap" ?',
            false,
        ),
        option.bool(
            "95377",
            "Captain o' Awe Locks",
            'Mode: [select] only\nShould the bot buy "Captain o\' Awe Locks" ?',
            false,
        ),
        option.bool(
            "95378",
            "Captain o' Awe Patch",
            'Mode: [select] only\nShould the bot buy "Captain o\' Awe Patch" ?',
            false,
        ),
        option.bool(
            "95379",
            "Captain o' Awe Eyepatch",
            'Mode: [select] only\nShould the bot buy "Captain o\' Awe Eyepatch" ?',
            false,
        ),
        option.bool(
            "94714",
            "Novac Sal Pirate Morph",
            'Mode: [select] only\nShould the bot buy "Novac Sal Pirate Morph" ?',
            false,
        ),
        option.bool(
            "94715",
            "Novac Sal Pirate Visage",
            'Mode: [select] only\nShould the bot buy "Novac Sal Pirate Visage" ?',
            false,
        ),
        option.bool(
            "94723",
            "First Gold Cutlass",
            'Mode: [select] only\nShould the bot buy "First Gold Cutlass" ?',
            false,
        ),
        option.bool("95387", "Rapier of Awe", 'Mode: [select] only\nShould the bot buy "Rapier of Awe" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PiratePlunder.select,
});

export default function main(): void {
    const script = new PiratePlunder();
    Core.bankingBlackList.push(
        "Belladonna's Flag",
        "Bourgeois' Flag",
        "Cutlass of Awe",
        "Eyepatch",
        "First Gold Rapier",
        "J6's Secret Hideout Map",
        "Mercurius' Flag",
        "Merry Celeste's Flag",
        "Novac Sal Eyepatch Morph",
        "Novac Sal Eyepatch Visage",
        "Novac Sal Morph",
        "Novac Sal Visage",
        "Pirated Tech's Flag",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
