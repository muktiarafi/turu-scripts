/*
name: Magnis Merge
description: This bot will farm the items belonging to the selected mode for the Magnis Merge [2602] in /thelimacity
tags: magnis, merge, thelimacity, mindbreaker, paladin, w, shield, mindbreakers, winged, morph, paladins, faceplate, heroic, ground, spear, , mana, solace
*/
// Port of Scripts/Other/MergeShops/MagnisMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MagnisMerge {
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
                //#region Items not setup
                case "Refined Orpheum":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10334);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("somnia", "r9", "Left", "*");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Somnic Extract":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.registerQuests(10335);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("somnia", "Nightwyrm", "Nightwyrm Head");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dwarven Ether":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10332);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("dwarfhold", "Chaotic Draconian", "Draconian Chaos Ether", 8);
                        Core.huntMonster("dwarfhold", "Chaos Drow", "Drow Chaos Ether", 8);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Theliman Ore":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10333);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.killMonster("mountainpath", "Enter", "Spawn", "*", "Coarse Ore", 21);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("thelimacity", 2602, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "82109",
            "MindBreaker Paladin",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin" ?',
            false,
        ),
        option.bool(
            "82110",
            "MindBreaker Paladin w/ Shield",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin w/ Shield" ?',
            false,
        ),
        option.bool(
            "82115",
            "MindBreaker's Winged Hair",
            'Mode: [select] only\nShould the bot buy "MindBreaker\'s Winged Hair" ?',
            false,
        ),
        option.bool(
            "82116",
            "MindBreaker's Winged Locks",
            'Mode: [select] only\nShould the bot buy "MindBreaker\'s Winged Locks" ?',
            false,
        ),
        option.bool(
            "82117",
            "MindBreaker's Winged Morph",
            'Mode: [select] only\nShould the bot buy "MindBreaker\'s Winged Morph" ?',
            false,
        ),
        option.bool(
            "82118",
            "MindBreaker's Winged Visage",
            'Mode: [select] only\nShould the bot buy "MindBreaker\'s Winged Visage" ?',
            false,
        ),
        option.bool(
            "82121",
            "MindBreaker Paladin's Faceplate",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Faceplate" ?',
            false,
        ),
        option.bool(
            "82124",
            "MindBreaker Paladin's Winged Helm",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Winged Helm" ?',
            false,
        ),
        option.bool(
            "82125",
            "MindBreaker Paladin's Heroic Helm",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Heroic Helm" ?',
            false,
        ),
        option.bool(
            "82126",
            "MindBreaker Paladin's Cape",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Cape" ?',
            false,
        ),
        option.bool(
            "82128",
            "MindBreaker Paladin's Rune",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Rune" ?',
            false,
        ),
        option.bool(
            "82127",
            "MindBreaker Paladin's Rune Cape",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Rune Cape" ?',
            false,
        ),
        option.bool(
            "82129",
            "MindBreaker Paladin's Ground",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Ground" ?',
            false,
        ),
        option.bool(
            "82131",
            "MindBreaker Paladin's Sword",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Sword" ?',
            false,
        ),
        option.bool(
            "82132",
            "MindBreaker Paladin's Swords",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Swords" ?',
            false,
        ),
        option.bool(
            "82133",
            "MindBreaker Paladin's Spear",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Spear" ?',
            false,
        ),
        option.bool(
            "82134",
            "MindBreaker Paladin's Shield",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Shield" ?',
            false,
        ),
        option.bool(
            "82136",
            "MindBreaker Paladin's Spear + Shield",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Spear + Shield" ?',
            false,
        ),
        option.bool(
            "82137",
            "MindBreaker Paladin's Axe",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Axe" ?',
            false,
        ),
        option.bool(
            "82138",
            "MindBreaker Paladin's Axes",
            'Mode: [select] only\nShould the bot buy "MindBreaker Paladin\'s Axes" ?',
            false,
        ),
        option.bool(
            "94776",
            "Mana Solace Paladin",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin" ?',
            false,
        ),
        option.bool(
            "94777",
            "Mana Solace Paladin w/ Shield",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin w/ Shield" ?',
            false,
        ),
        option.bool(
            "94782",
            "Mana Solace Winged Hair",
            'Mode: [select] only\nShould the bot buy "Mana Solace Winged Hair" ?',
            false,
        ),
        option.bool(
            "94783",
            "Mana Solace Winged Locks",
            'Mode: [select] only\nShould the bot buy "Mana Solace Winged Locks" ?',
            false,
        ),
        option.bool(
            "94784",
            "Mana Solace Winged Morph",
            'Mode: [select] only\nShould the bot buy "Mana Solace Winged Morph" ?',
            false,
        ),
        option.bool(
            "94785",
            "Mana Solace Winged Visage",
            'Mode: [select] only\nShould the bot buy "Mana Solace Winged Visage" ?',
            false,
        ),
        option.bool(
            "94788",
            "Mana Solace Paladin's Faceplate",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Faceplate" ?',
            false,
        ),
        option.bool(
            "94791",
            "Mana Solace Paladin's Winged Helm",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Winged Helm" ?',
            false,
        ),
        option.bool(
            "94792",
            "Mana Solace Heroic Helm",
            'Mode: [select] only\nShould the bot buy "Mana Solace Heroic Helm" ?',
            false,
        ),
        option.bool(
            "94793",
            "Mana Solace Paladin's Cape",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Cape" ?',
            false,
        ),
        option.bool(
            "94794",
            "Mana Solace Paladin's Rune Cape",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Rune Cape" ?',
            false,
        ),
        option.bool(
            "94795",
            "Mana Solace Paladin's Rune",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Rune" ?',
            false,
        ),
        option.bool(
            "94796",
            "Mana Solace Paladin's Ground",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Ground" ?',
            false,
        ),
        option.bool(
            "94798",
            "Mana Solace Paladin's Sword",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Sword" ?',
            false,
        ),
        option.bool(
            "94799",
            "Mana Solace Paladin's Swords",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Swords" ?',
            false,
        ),
        option.bool(
            "94800",
            "Mana Solace Paladin's Spear",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Spear" ?',
            false,
        ),
        option.bool(
            "94801",
            "Mana Solace Paladin's Shield",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Shield" ?',
            false,
        ),
        option.bool(
            "94803",
            "Mana Solace Paladin's Spear + Shield",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Spear + Shield" ?',
            false,
        ),
        option.bool(
            "94804",
            "Mana Solace Paladin's Axe",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Axe" ?',
            false,
        ),
        option.bool(
            "94805",
            "Mana Solace Paladin's Axes",
            'Mode: [select] only\nShould the bot buy "Mana Solace Paladin\'s Axes" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MagnisMerge.select,
});

export default function main(): void {
    const script = new MagnisMerge();
    Core.bankingBlackList.push("Refined Orpheum", "Somnic Extract", "Dwarven Ether", "Theliman Ore");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
