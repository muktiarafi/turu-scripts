/*
name: Temple Siege Merge
description: Merges all the items needed for the Temple Siege storyline.
tags: merge, mats, quest, temple, siege, nulgath, seasonal, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/Nulgath/TempleSiegeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";
import { CoreNation } from "../../../nation/CoreNation";
import { DragonBladeofNulgath } from "../../../nation/various/DragonBlade[mem]";
import { TempleSiege } from "./TempleSiege";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const DB = new DragonBladeofNulgath();
const TS = new TempleSiege();

export class TempleSiegeMerge {
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
                case "Gem of Nulgath":
                    Nation.farmGemofNulgath(quant);
                    break;
                case "Shadow Extract":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9068);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("templesiege", "Doomed Oblivion", "Oblivion's Gem", undefined, { log: false });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("templesiege", "Doomed Beast", "Dark Remnants", 7, { log: false });
                        Core.huntMonster("templesiege", "Overdriven Paladin", "Paladin Armament", 7, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
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
                case "Blood Gem of the Archfiend":
                    Nation.farmBloodGem(quant);
                    break;
                case "Warden of Light":
                    Core.farmingLogger(req.name, quant);
                    Farm.bludrutBrawlBoss(undefined, 500);
                    Core.buyItem("battleon", 222, req.name);
                    break;
                case "Conqueror of Shadow":
                    Core.farmingLogger(req.name, quant);
                    Farm.bludrutBrawlBoss(undefined, 350);
                    Core.buyItem("battleon", 222, req.name);
                    break;
                case "Crimson Plate of Nulgath":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.ensureAccept(765);
                    Nation.farmTotemofNulgath(3);
                    Core.huntMonster("underworld", "Skull Warrior", "Skull Warrior Rune");
                    Core.ensureComplete(765, 4695);
                    break;
                case "Behemoth Blade of Light":
                    DB.behemothBladeof("Light");
                    break;
                case "Behemoth Blade of Shadow":
                    DB.behemothBladeof("Shadow");
                    break;
                case "DragonFire of Nulgath":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.ensureAccept(765);
                    Nation.farmTotemofNulgath(3);
                    Core.huntMonster("underworld", "Skull Warrior", "Skull Warrior Rune");
                    Core.ensureComplete(765, 1316);
                    break;
                case "Light Warden Helm":
                    Core.farmingLogger(req.name, quant);
                    Farm.bludrutBrawlBoss(undefined, 150);
                    Core.buyItem("battleon", 222, req.name);
                    break;
                case "Shadow Conqueror Helm":
                    Core.farmingLogger(req.name, quant);
                    Farm.bludrutBrawlBoss(undefined, 100);
                    Core.buyItem("battleon", 222, req.name);
                    break;
                case "Crimson Face Plate of Nulgath":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.ensureAccept(765);
                    Nation.farmTotemofNulgath(3);
                    Core.huntMonster("underworld", "Skull Warrior", "Skull Warrior Rune");
                    Core.ensureComplete(765, 4961);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("templesiege")) {
            return;
        }

        TS.completeTempleSiege();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("templesiege", 2227, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "75653",
            "Beetle General Pet",
            'Mode: [select] only\nShould the bot buy "Beetle General Pet" ?',
            false,
        ),
        option.bool(
            "75315",
            "Awakened Fiendslasher",
            'Mode: [select] only\nShould the bot buy "Awakened Fiendslasher" ?',
            false,
        ),
        option.bool(
            "75316",
            "Awakened Fiendslashers",
            'Mode: [select] only\nShould the bot buy "Awakened Fiendslashers" ?',
            false,
        ),
        option.bool(
            "75317",
            "Awakened Fiend's Staff",
            'Mode: [select] only\nShould the bot buy "Awakened Fiend\'s Staff" ?',
            false,
        ),
        option.bool(
            "75318",
            "Awakened Fiend's Spear",
            'Mode: [select] only\nShould the bot buy "Awakened Fiend\'s Spear" ?',
            false,
        ),
        option.bool("75776", "Abyssal Makai", 'Mode: [select] only\nShould the bot buy "Abyssal Makai" ?', false),
        option.bool(
            "69138",
            "Evolved Warden of Light",
            'Mode: [select] only\nShould the bot buy "Evolved Warden of Light" ?',
            false,
        ),
        option.bool(
            "69143",
            "Evolved Conqueror of Shadows",
            'Mode: [select] only\nShould the bot buy "Evolved Conqueror of Shadows" ?',
            false,
        ),
        option.bool(
            "69148",
            "Evolved Crimson Plate of Nulgath",
            'Mode: [select] only\nShould the bot buy "Evolved Crimson Plate of Nulgath" ?',
            false,
        ),
        option.bool(
            "69141",
            "Warden of Light's Blade",
            'Mode: [select] only\nShould the bot buy "Warden of Light\'s Blade" ?',
            false,
        ),
        option.bool(
            "69146",
            "Conqueror of Shadows's Blade",
            'Mode: [select] only\nShould the bot buy "Conqueror of Shadows\'s Blade" ?',
            false,
        ),
        option.bool(
            "69151",
            "Evolved DragonFire of Nulgath",
            'Mode: [select] only\nShould the bot buy "Evolved DragonFire of Nulgath" ?',
            false,
        ),
        option.bool(
            "69139",
            "Evolved Warden of Light's Mask",
            'Mode: [select] only\nShould the bot buy "Evolved Warden of Light\'s Mask" ?',
            false,
        ),
        option.bool(
            "69140",
            "Evolved Warden of Light's Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Evolved Warden of Light\'s Mask + Locks" ?',
            false,
        ),
        option.bool(
            "69144",
            "Evolved Conqueror of Shadows's Mask",
            'Mode: [select] only\nShould the bot buy "Evolved Conqueror of Shadows\'s Mask" ?',
            false,
        ),
        option.bool(
            "69145",
            "Evolved Conqueror of Shadows's Mask + Locks",
            'Mode: [select] only\nShould the bot buy "Evolved Conqueror of Shadows\'s Mask + Locks" ?',
            false,
        ),
        option.bool(
            "69149",
            "Evolved Crimson Mask of Nulgath",
            'Mode: [select] only\nShould the bot buy "Evolved Crimson Mask of Nulgath" ?',
            false,
        ),
        option.bool(
            "69150",
            "Evolved Crimson Mask + Locks of Nulgath",
            'Mode: [select] only\nShould the bot buy "Evolved Crimson Mask + Locks of Nulgath" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TempleSiegeMerge.select,
});

export default function main(): void {
    const script = new TempleSiegeMerge();
    Core.bankingBlackList.push(
        "Beetle General Pet",
        "Gem of Nulgath",
        "Shadow Extract",
        "Unidentified 13",
        "Tainted Gem",
        "Dark Crystal Shard",
        "Diamond of Nulgath",
        "Blood Gem of the Archfiend",
        "Warden of Light",
        "Conqueror of Shadow",
        "Crimson Plate of Nulgath",
        "Behemoth Blade of Light",
        "Behemoth Blade of Shadow",
        "DragonFire of Nulgath",
        "Light Warden Helm",
        "Shadow Conqueror Helm",
        "Crimson Face Plate of Nulgath",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
