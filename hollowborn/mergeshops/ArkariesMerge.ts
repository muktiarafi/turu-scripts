/*
name: Arkaries Merge
description: This bot will farm the items belonging to the selected mode for the Arkaries Merge [2510] in /hbchallenge
tags: arkaries, merge, hbchallenge, hollowborn, wyvernslayer, noble, dragonknight, dragonlord, dragonberserker, dragonbulwark, plumed, armet, fury, plated, rage, dragons, curse, scythe, drake, halberd, masterblade, sapphire, dragon, statue, emerald, topaz, tourmaline, amethyst, ruby, turquoise, diamond, tiger, eye
*/
// Port of Scripts/Hollowborn/MergeShops/ArkariesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ArkariesMerge {
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
                case "Hollow Soul":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAcceptmultiple(7553, 7555);
                        Core.killMonster("shadowrealm", "r2", "Left", "Gargrowl", "Darkseed", 8, { log: false });
                        Core.killMonster("shadowrealm", "r2", "Left", "Shadow Guardian", "Shadow Medallion", 5, {
                            log: false,
                        });
                        Core.ensureComplete(7553);
                        Core.ensureComplete(7555);
                    }
                    bot.wait.forPickup(req.name);
                    break;
                case "Obsidian Hollowborn Dragon Statue":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("hbchallenge", "Nameless Dragonlord", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Hollowborn Dragon Heart":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(9990, "hbchallenge", "Nameless Dragonlord");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Hollowborn Wyvern Heart":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonsterQuest(9989, "hbchallenge", "Hollowborn Wyvern");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Hollowborn Dragonknight Armet":

                case "Hollowborn DragonBerserker Helm":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("hbchallenge", "Nameless Dragonlord", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hbchallenge", 2510, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "55362",
            "Hollowborn WyvernSlayer",
            'Mode: [select] only\nShould the bot buy "Hollowborn WyvernSlayer" ?',
            false,
        ),
        option.bool(
            "90105",
            "Noble Hollowborn DragonKnight",
            'Mode: [select] only\nShould the bot buy "Noble Hollowborn DragonKnight" ?',
            false,
        ),
        option.bool(
            "90106",
            "Noble Hollowborn Dragonlord",
            'Mode: [select] only\nShould the bot buy "Noble Hollowborn Dragonlord" ?',
            false,
        ),
        option.bool(
            "90107",
            "Hollowborn DragonBerserker",
            'Mode: [select] only\nShould the bot buy "Hollowborn DragonBerserker" ?',
            false,
        ),
        option.bool(
            "90109",
            "Hollowborn DragonBulwark",
            'Mode: [select] only\nShould the bot buy "Hollowborn DragonBulwark" ?',
            false,
        ),
        option.bool(
            "90112",
            "Plumed Hollowborn Dragonknight Armet",
            'Mode: [select] only\nShould the bot buy "Plumed Hollowborn Dragonknight Armet" ?',
            false,
        ),
        option.bool(
            "90115",
            "Hollowborn DragonBerserker Fury Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn DragonBerserker Fury Helm" ?',
            false,
        ),
        option.bool(
            "90116",
            "Hollowborn DragonBerserker Plated Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn DragonBerserker Plated Helm" ?',
            false,
        ),
        option.bool(
            "90117",
            "Plumed Hollowborn DragonBerserker Helm",
            'Mode: [select] only\nShould the bot buy "Plumed Hollowborn DragonBerserker Helm" ?',
            false,
        ),
        option.bool(
            "90111",
            "Noble Hollowborn Dragonknight Armet",
            'Mode: [select] only\nShould the bot buy "Noble Hollowborn Dragonknight Armet" ?',
            false,
        ),
        option.bool(
            "90114",
            "Noble Hollowborn DragonBerserker Helm",
            'Mode: [select] only\nShould the bot buy "Noble Hollowborn DragonBerserker Helm" ?',
            false,
        ),
        option.bool(
            "90118",
            "Hollowborn DragonBerserker Rage Helm",
            'Mode: [select] only\nShould the bot buy "Hollowborn DragonBerserker Rage Helm" ?',
            false,
        ),
        option.bool(
            "90120",
            "Hollowborn Dragon's Curse",
            'Mode: [select] only\nShould the bot buy "Hollowborn Dragon\'s Curse" ?',
            false,
        ),
        option.bool(
            "90126",
            "Hollowborn Dragonknight Scythe",
            'Mode: [select] only\nShould the bot buy "Hollowborn Dragonknight Scythe" ?',
            false,
        ),
        option.bool(
            "90127",
            "Hollowborn Drake Halberd",
            'Mode: [select] only\nShould the bot buy "Hollowborn Drake Halberd" ?',
            false,
        ),
        option.bool(
            "90128",
            "Hollowborn Dragonlord MasterBlade",
            'Mode: [select] only\nShould the bot buy "Hollowborn Dragonlord MasterBlade" ?',
            false,
        ),
        option.bool(
            "90297",
            "Sapphire Hollowborn Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Sapphire Hollowborn Dragon Statue" ?',
            false,
        ),
        option.bool(
            "90298",
            "Emerald Hollowborn Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Emerald Hollowborn Dragon Statue" ?',
            false,
        ),
        option.bool(
            "90299",
            "Topaz Hollowborn Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Topaz Hollowborn Dragon Statue" ?',
            false,
        ),
        option.bool(
            "90300",
            "Tourmaline Hollowborn Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Tourmaline Hollowborn Dragon Statue" ?',
            false,
        ),
        option.bool(
            "90301",
            "Amethyst Hollowborn Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Amethyst Hollowborn Dragon Statue" ?',
            false,
        ),
        option.bool(
            "90302",
            "Ruby Hollowborn Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Ruby Hollowborn Dragon Statue" ?',
            false,
        ),
        option.bool(
            "90303",
            "Turquoise Hollowborn Dragon Statue",
            'Mode: [select] only\nShould the bot buy "Turquoise Hollowborn Dragon Statue" ?',
            false,
        ),
        option.bool(
            "90304",
            "Diamond Hollowborn Dragon",
            'Mode: [select] only\nShould the bot buy "Diamond Hollowborn Dragon" ?',
            false,
        ),
        option.bool(
            "90305",
            "Tiger Eye Hollowborn Dragon",
            'Mode: [select] only\nShould the bot buy "Tiger Eye Hollowborn Dragon" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ArkariesMerge.select,
});

export default function main(): void {
    const script = new ArkariesMerge();
    Core.bankingBlackList.push(
        "Hollowborn Dragon Heart",
        "Hollowborn Wyvern Heart",
        "Hollowborn Dragonknight Armet",
        "Hollowborn DragonBerserker Helm",
        "Hollow Soul",
        "Obsidian Hollowborn Dragon Statue",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
