/*
name: Oblivion Tundra Merge
description: This bot will farm the items belonging to the selected mode for the Oblivion Tundra Merge [2477] in /obliviontundra
tags: oblivion, tundra, merge, obliviontundra, envenomed, spear, nulgath, fiend, voids, desire, hunger, healing, euclid, nation, healer, rogues, knives, knife, reverse, rogue, thaumaturgy, tools, tome, fiends, catalyst, thaumaturge, hunters, trust, bounty, dealbreaker, warrior, armet
*/
// Port of Scripts/Nation/MergeShops/OblivionTundraMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { FiendishLoreMasterMerge } from "./FiendishLoreMasterMerge";
import { OblivionTundra } from "../../story/nation/OblivionTundra";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const FLM = new FiendishLoreMasterMerge();
const OT = new OblivionTundra();

export class OblivionTundraMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            //#region Useable Monsters
            const UseableMonsters = [
                "Empty Creature", // UseableMonsters[0],
                "Hushed", // UseableMonsters[1],
                "Withered Archfiend", // UseableMonsters[2],
                "Oblivion Magus ", // UseableMonsters[3],
                "Ettin Fiend", // UseableMonsters[4],
                "Archfiend Oblivion", // UseableMonsters[5],
                "Infinity Pool", // UseableMonsters[6]
            ];
            //#endregion Useable Monsters
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
                case "Unidentified 13":
                    Nation.farmUni13(quant);
                    break;
                case "Tainted Gem":
                    Nation.farmTaintedGem(quant);
                    break;
                case "Dark Crystal Shard":
                    Nation.farmDarkCrystalShard(quant);
                    break;
                case "Diamond of Nulgath":
                    Nation.farmDiamondofNulgath(quant);
                    break;
                case "Null Contract":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10046);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("obliviontundra", UseableMonsters[1], "Fiend Shard Dust", 6, { log: false });
                        Core.huntMonster("obliviontundra", UseableMonsters[4], "Rotten Branch", 6, { log: false });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("obliviontundra", UseableMonsters[5], "Oblivion Ring", 1, { log: false });

                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Withered Archfiend's Essence":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("obliviontundra", UseableMonsters[2], req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "ArchFiend Healer Staff":

                case "ArchFiend Healer Hood":

                case "ArchFiend Rogue Knives":

                case "ArchFiend Rogue Knife":

                case "ArchFiend Rogue Backwards Knives":

                case "ArchFiend Rogue Backwards Knife":

                case "ArchFiend Mage Book + Wand":

                case "ArchFiend Mage Hood":

                case "ArchFiend Mage Hat":

                case "Dual ArchFiend Warrior Champion Swords":

                case "ArchFiend Warrior Champion Sword":

                case "Dual ArchFiend Warrior Swords":

                case "ArchFiend Warrior Helm":

                case "ArchFiend Warrior Armet":

                case "ArchFiend Healer":

                case "ArchFiend Rogue":

                case "ArchFiend Mage":

                case "ArchFiend Warrior":
                    FLM.buyAllMerge(req.name);
                    break;
                case "ArchFiend Mage's Tome":

                case "ArchFiend Mage's Wand":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("enemyforest", "Evil Elemental", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
            }
        };
        OT.storyline();
        Adv.startBuyAllMerge("obliviontundra", 2477, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "79257",
            "Envenomed Spear of Nulgath",
            'Mode: [select] only\nShould the bot buy "Envenomed Spear of Nulgath" ?',
            false,
        ),
        option.bool(
            "79255",
            "Fiend Void's Desire",
            'Mode: [select] only\nShould the bot buy "Fiend Void\'s Desire" ?',
            false,
        ),
        option.bool(
            "91497",
            "Dual Fiend Void's Hunger",
            'Mode: [select] only\nShould the bot buy "Dual Fiend Void\'s Hunger" ?',
            false,
        ),
        option.bool(
            "79253",
            "Fiend Void's Hunger",
            'Mode: [select] only\nShould the bot buy "Fiend Void\'s Hunger" ?',
            false,
        ),
        option.bool(
            "66980",
            "Healing Euclid Staff",
            'Mode: [select] only\nShould the bot buy "Healing Euclid Staff" ?',
            false,
        ),
        option.bool(
            "66979",
            "Nation Healer Hood",
            'Mode: [select] only\nShould the bot buy "Nation Healer Hood" ?',
            false,
        ),
        option.bool("66978", "Nation Healer", 'Mode: [select] only\nShould the bot buy "Nation Healer" ?', false),
        option.bool(
            "66974",
            "Nation Rogue's Knives",
            'Mode: [select] only\nShould the bot buy "Nation Rogue\'s Knives" ?',
            false,
        ),
        option.bool(
            "66973",
            "Nation Rogue's Knife",
            'Mode: [select] only\nShould the bot buy "Nation Rogue\'s Knife" ?',
            false,
        ),
        option.bool(
            "66972",
            "Reverse Nation Rogue's Knives",
            'Mode: [select] only\nShould the bot buy "Reverse Nation Rogue\'s Knives" ?',
            false,
        ),
        option.bool(
            "66971",
            "Reverse Nation Rogue's Knife",
            'Mode: [select] only\nShould the bot buy "Reverse Nation Rogue\'s Knife" ?',
            false,
        ),
        option.bool("66970", "Nation Rogue", 'Mode: [select] only\nShould the bot buy "Nation Rogue" ?', false),
        option.bool(
            "66961",
            "Nation Thaumaturgy Tools",
            'Mode: [select] only\nShould the bot buy "Nation Thaumaturgy Tools" ?',
            false,
        ),
        option.bool(
            "66960",
            "Nation Thaumaturgy Tome",
            'Mode: [select] only\nShould the bot buy "Nation Thaumaturgy Tome" ?',
            false,
        ),
        option.bool(
            "66959",
            "Fiend's Euclid Catalyst",
            'Mode: [select] only\nShould the bot buy "Fiend\'s Euclid Catalyst" ?',
            false,
        ),
        option.bool(
            "66958",
            "Nation Thaumaturge Hood",
            'Mode: [select] only\nShould the bot buy "Nation Thaumaturge Hood" ?',
            false,
        ),
        option.bool(
            "66957",
            "Nation Thaumaturge Hat",
            'Mode: [select] only\nShould the bot buy "Nation Thaumaturge Hat" ?',
            false,
        ),
        option.bool(
            "66956",
            "Nation Thaumaturge",
            'Mode: [select] only\nShould the bot buy "Nation Thaumaturge" ?',
            false,
        ),
        option.bool(
            "66949",
            "Dual Fiend Hunter's Trust",
            'Mode: [select] only\nShould the bot buy "Dual Fiend Hunter\'s Trust" ?',
            false,
        ),
        option.bool(
            "66948",
            "Fiend Hunter's Trust",
            'Mode: [select] only\nShould the bot buy "Fiend Hunter\'s Trust" ?',
            false,
        ),
        option.bool(
            "66947",
            "Dual Bounty Hunter's Dealbreaker",
            'Mode: [select] only\nShould the bot buy "Dual Bounty Hunter\'s Dealbreaker" ?',
            false,
        ),
        option.bool(
            "66946",
            "Bounty Hunter's Dealbreaker",
            'Mode: [select] only\nShould the bot buy "Bounty Hunter\'s Dealbreaker" ?',
            false,
        ),
        option.bool("66943", "Nation Warrior", 'Mode: [select] only\nShould the bot buy "Nation Warrior" ?', false),
        option.bool(
            "66945",
            "Nation Warrior Helm",
            'Mode: [select] only\nShould the bot buy "Nation Warrior Helm" ?',
            false,
        ),
        option.bool(
            "66944",
            "Nation Warrior Armet",
            'Mode: [select] only\nShould the bot buy "Nation Warrior Armet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: OblivionTundraMerge.select,
});

export default function main(): void {
    const script = new OblivionTundraMerge();
    Core.bankingBlackList.push(
        "Unidentified 13",
        "Tainted Gem",
        "Dark Crystal Shard",
        "Diamond of Nulgath",
        "Null Contract",
        "Withered Archfiend's Essence",
        "ArchFiend Healer Staff",
        "ArchFiend Healer Hood",
        "ArchFiend Healer",
        "ArchFiend Rogue Knives",
        "ArchFiend Rogue Knife",
        "ArchFiend Rogue Backwards Knives",
        "ArchFiend Rogue Backwards Knife",
        "ArchFiend Rogue",
        "ArchFiend Mage Book + Wand",
        "ArchFiend Mage's Tome",
        "ArchFiend Mage's Wand",
        "ArchFiend Mage Hood",
        "ArchFiend Mage Hat",
        "ArchFiend Mage",
        "Dual ArchFiend Warrior Champion Swords",
        "ArchFiend Warrior Champion Sword",
        "Dual ArchFiend Warrior Swords",
        "ArchFiend Warrior Sword",
        "ArchFiend Warrior",
        "ArchFiend Warrior Helm",
        "ArchFiend Warrior Armet",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
