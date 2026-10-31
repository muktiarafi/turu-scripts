/*
name: Crag's Gem Merge
description: This script farms all the materials needed for Crag's Gem Merge in tercessuinotlim.
tags: crag, nulgath, merge, gem, empowered voidstone
*/
// Port of Scripts/Nation/MergeShops/CragsGemMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class CragsGemMerge {
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
                case "Empowered Voidstone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7277);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("wanders", "r2", "Down", "Kalestri Worshiper", undefined, undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ice Diamond":
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7279);
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop("Ice Diamond");
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(7279);
                        Core.killMonster("kingcoal", "r1", "Left", "*", "Frozen Coal", 10, { log: false });
                        Core.ensureComplete(7279);
                        bot.wait.forPickup("Ice Diamond");
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dark Bloodstone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7281);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("safiria", "Blood Maggot", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Butterfly Sapphire":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7287);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("bloodtusk", "Trollola Plant", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Understone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7289);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("battleunderc", "Blue Crystalized Undead", undefined, undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Rainbow Moonstone":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7291);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("earthstorm", "Diamond Golem", "Chip of Diamond", undefined, { log: false });
                        Core.huntMonster("earthstorm", "Emerald Golem", "Chip of Emerald", undefined, { log: false });
                        Core.huntMonster("earthstorm", "Ruby Golem", "Chip of Ruby", undefined, { log: false });
                        Core.huntMonster("earthstorm", "Sapphire Golem", "Chip of Sapphire", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Farm.craggleRockREP();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tercessuinotlim", 1819, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "52627",
            "SkinWalker Warrior",
            'Mode: [select] only\nShould the bot buy "SkinWalker Warrior" ?',
            false,
        ),
        option.bool("52628", "SkinWalker Druid", 'Mode: [select] only\nShould the bot buy "SkinWalker Druid" ?', false),
        option.bool("52629", "Void SkinWalker", 'Mode: [select] only\nShould the bot buy "Void SkinWalker" ?', false),
        option.bool(
            "52630",
            "Void SkinWalker Fiend",
            'Mode: [select] only\nShould the bot buy "Void SkinWalker Fiend" ?',
            false,
        ),
        option.bool(
            "52631",
            "SkinWalker's Female Morph",
            'Mode: [select] only\nShould the bot buy "SkinWalker\'s Female Morph" ?',
            false,
        ),
        option.bool(
            "52632",
            "SkinWalker's Male Morph",
            'Mode: [select] only\nShould the bot buy "SkinWalker\'s Male Morph" ?',
            false,
        ),
        option.bool(
            "52633",
            "SkinWalker's Female Horns",
            'Mode: [select] only\nShould the bot buy "SkinWalker\'s Female Horns" ?',
            false,
        ),
        option.bool(
            "52634",
            "SkinWalker's Male Horns",
            'Mode: [select] only\nShould the bot buy "SkinWalker\'s Male Horns" ?',
            false,
        ),
        option.bool(
            "52635",
            "SkinWalker's Void Helm",
            'Mode: [select] only\nShould the bot buy "SkinWalker\'s Void Helm" ?',
            false,
        ),
        option.bool(
            "52636",
            "Void SkinWalker's Horns",
            'Mode: [select] only\nShould the bot buy "Void SkinWalker\'s Horns" ?',
            false,
        ),
        option.bool(
            "52637",
            "Void SkinWalker's Morph",
            'Mode: [select] only\nShould the bot buy "Void SkinWalker\'s Morph" ?',
            false,
        ),
        option.bool(
            "52638",
            "SkinWalker Fiend's Morph",
            'Mode: [select] only\nShould the bot buy "SkinWalker Fiend\'s Morph" ?',
            false,
        ),
        option.bool(
            "52639",
            "SkinWalker Fiend's Horns",
            'Mode: [select] only\nShould the bot buy "SkinWalker Fiend\'s Horns" ?',
            false,
        ),
        option.bool(
            "52640",
            "Tribal SkinWalker's Morph",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Morph" ?',
            false,
        ),
        option.bool(
            "52641",
            "Tribal SkinWalker's Horns",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Horns" ?',
            false,
        ),
        option.bool(
            "52642",
            "Tribal SkinWalker's Spiked Wrap",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Spiked Wrap" ?',
            false,
        ),
        option.bool(
            "52643",
            "Tribal SkinWalker's Wrap",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Wrap" ?',
            false,
        ),
        option.bool(
            "52644",
            "Tribal SkinWalker's Tail",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Tail" ?',
            false,
        ),
        option.bool(
            "52645",
            "Tribal SkinWalker's Axe",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Axe" ?',
            false,
        ),
        option.bool(
            "52646",
            "Tribal SkinWalker's Poleaxe",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Poleaxe" ?',
            false,
        ),
        option.bool(
            "52647",
            "Tribal SkinWalker's Spear",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Spear" ?',
            false,
        ),
        option.bool(
            "52648",
            "Tribal SkinWalker's Skull Mace",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Skull Mace" ?',
            false,
        ),
        option.bool(
            "52649",
            "Tribal SkinWalker's Staff",
            'Mode: [select] only\nShould the bot buy "Tribal SkinWalker\'s Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CragsGemMerge.select,
});

export default function main(): void {
    const script = new CragsGemMerge();
    Core.bankingBlackList.push(
        "Empowered Voidstone",
        "Ice Diamond",
        "Dark Bloodstone",
        "Butterfly Sapphire",
        "Understone",
        "Rainbow Moonstone",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
