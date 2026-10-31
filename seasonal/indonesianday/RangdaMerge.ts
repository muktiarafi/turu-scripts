/*
name: Rangda Merge
description: This bot will farm the items belonging to the selected mode for the Rangda Merge [1901] in /rangda
tags: rangda, merge, sableng, gendeng, archipelago, marshland, gatotkaca, gatot, crown, bearded, sheath, keris, arjunas, bow, mace, wings, warok, warlord, ironbeard, morph, scarlet, singa, barong, waroks, binding, cord, cords, serpent, lash, ponorogo, nyi, roro, kidul, regalia, southern, kings, sea, kiduls, turban, tidebound, maiden, reog, companion, aegis, golden, garuda, sky, guardian, hidden, talon, sovereign, ceremonial
*/
// Port of Scripts/Seasonal/IndonesianDay/RangdaMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { RangdaSeasonal } from "./Rangda";

const Adv = new CoreAdvanced();
const rangdaSeasonal = new RangdaSeasonal();

export class RangdaMerge {
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            if (req == null) {
                return;
            }

            switch (req.name) {
                case "Abhorrent Remnant":

                case "Ocean Maiden's Locks":

                case "Southern King Hair":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("rangda", "Tuyul", req.name, quant, { isTemp: req.temp });
                    break;
                case "Batik Fabric":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10371);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("rangda", "Rangda", "Rangda Rematched", 1);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Benang":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(10372);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("rangda", "Tuyul", "Tuyul Soul", 9);
                        Core.huntMonster("rangda", "Leyak", "Leyak Jaw", 9);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Duskwind Warok Visage":

                case "Elder Warok Morph":

                case "Gendeng's Wild Axe":

                case "Gendeng's Wild Hammer":

                case "Rangda's Mask":

                case "Warok's Wicked Snapper":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("rangda", "Rangda", req.name, quant, { isTemp: req.temp });
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
        if (!Core.isSeasonalMapActive("rangda")) {
            return;
        }

        rangdaSeasonal.storyLine();
        Adv.startBuyAllMerge("rangda", 1901, findIngredients, buyOnlyThis, { buyMode });
    }

    static readonly select = [
        option.bool("55784", "Gatotkaca", 'Mode: [select] only\nShould the bot buy "Gatotkaca" ?', false),
        option.bool("94994", "Warok Warlord", 'Mode: [select] only\nShould the bot buy "Warok Warlord" ?', false),
        option.bool(
            "95057",
            "Nyi Roro Kidul Regalia",
            'Mode: [select] only\nShould the bot buy "Nyi Roro Kidul Regalia" ?',
            false,
        ),
        option.bool("95056", "Tidebound Maiden", 'Mode: [select] only\nShould the bot buy "Tidebound Maiden" ?', false),
        option.bool("94995", "Reog Companion", 'Mode: [select] only\nShould the bot buy "Reog Companion" ?', false),
        option.bool(
            "94983",
            "Aegis of the Golden Garuda",
            'Mode: [select] only\nShould the bot buy "Aegis of the Golden Garuda" ?',
            false,
        ),
        option.bool(
            "102590",
            "Sableng Archipelago Druid",
            'Mode: [select] only\nShould the bot buy "Sableng Archipelago Druid" ?',
            false,
        ),
        option.bool(
            "102711",
            "Sableng Marshland Druid",
            'Mode: [select] only\nShould the bot buy "Sableng Marshland Druid" ?',
            false,
        ),
        option.bool("55791", "Arjuna's Bow", 'Mode: [select] only\nShould the bot buy "Arjuna\'s Bow" ?', false),
        option.bool("55790", "Gatot Wings", 'Mode: [select] only\nShould the bot buy "Gatot Wings" ?', false),
        option.bool(
            "95012",
            "Warok's Binding Cords",
            'Mode: [select] only\nShould the bot buy "Warok\'s Binding Cords" ?',
            false,
        ),
        option.bool(
            "95020",
            "Serpent Lash of Ponorogo",
            'Mode: [select] only\nShould the bot buy "Serpent Lash of Ponorogo" ?',
            false,
        ),
        option.bool(
            "55795",
            "Gatot Sheath and Keris",
            'Mode: [select] only\nShould the bot buy "Gatot Sheath and Keris" ?',
            false,
        ),
        option.bool(
            "102600",
            "Gendeng's Wild Armaments",
            'Mode: [select] only\nShould the bot buy "Gendeng\'s Wild Armaments" ?',
            false,
        ),
        option.bool(
            "102712",
            "Sableng Marshland Hair",
            'Mode: [select] only\nShould the bot buy "Sableng Marshland Hair" ?',
            false,
        ),
        option.bool(
            "102713",
            "Sableng Marshland Locks",
            'Mode: [select] only\nShould the bot buy "Sableng Marshland Locks" ?',
            false,
        ),
        option.bool(
            "102591",
            "Sableng Archipelago Hair",
            'Mode: [select] only\nShould the bot buy "Sableng Archipelago Hair" ?',
            false,
        ),
        option.bool(
            "102592",
            "Sableng Archipelago Locks",
            'Mode: [select] only\nShould the bot buy "Sableng Archipelago Locks" ?',
            false,
        ),
        option.bool(
            "102593",
            "Sableng Archipelago Blindfold",
            'Mode: [select] only\nShould the bot buy "Sableng Archipelago Blindfold" ?',
            false,
        ),
        option.bool(
            "102594",
            "Sableng Archipelago Blindfold Locks",
            'Mode: [select] only\nShould the bot buy "Sableng Archipelago Blindfold Locks" ?',
            false,
        ),
        option.bool(
            "94984",
            "Crown of the Sky Guardian",
            'Mode: [select] only\nShould the bot buy "Crown of the Sky Guardian" ?',
            false,
        ),
        option.bool(
            "94985",
            "Hood of the Hidden Talon",
            'Mode: [select] only\nShould the bot buy "Hood of the Hidden Talon" ?',
            false,
        ),
        option.bool(
            "55785",
            "Gatot Crown and Locks",
            'Mode: [select] only\nShould the bot buy "Gatot Crown and Locks" ?',
            false,
        ),
        option.bool("55786", "Gatot Crown", 'Mode: [select] only\nShould the bot buy "Gatot Crown" ?', false),
        option.bool(
            "55787",
            "Bearded Gatot Crown",
            'Mode: [select] only\nShould the bot buy "Bearded Gatot Crown" ?',
            false,
        ),
        option.bool(
            "95061",
            "Southern King's Sea Crown",
            'Mode: [select] only\nShould the bot buy "Southern King\'s Sea Crown" ?',
            false,
        ),
        option.bool(
            "95062",
            "Nyi Roro Kidul's Sea Crown",
            'Mode: [select] only\nShould the bot buy "Nyi Roro Kidul\'s Sea Crown" ?',
            false,
        ),
        option.bool(
            "95063",
            "Nyi Roro Kidul's Visage",
            'Mode: [select] only\nShould the bot buy "Nyi Roro Kidul\'s Visage" ?',
            false,
        ),
        option.bool(
            "95064",
            "Southern Sea King's Visage",
            'Mode: [select] only\nShould the bot buy "Southern Sea King\'s Visage" ?',
            false,
        ),
        option.bool(
            "95065",
            "Southern Sea King's Turban",
            'Mode: [select] only\nShould the bot buy "Southern Sea King\'s Turban" ?',
            false,
        ),
        option.bool(
            "94996",
            "Ironbeard Warok Morph",
            'Mode: [select] only\nShould the bot buy "Ironbeard Warok Morph" ?',
            false,
        ),
        option.bool(
            "94997",
            "Scarlet Warok Visage",
            'Mode: [select] only\nShould the bot buy "Scarlet Warok Visage" ?',
            false,
        ),
        option.bool(
            "95000",
            "Singa Barong Visage",
            'Mode: [select] only\nShould the bot buy "Singa Barong Visage" ?',
            false,
        ),
        option.bool(
            "95011",
            "Warok's Binding Cord",
            'Mode: [select] only\nShould the bot buy "Warok\'s Binding Cord" ?',
            false,
        ),
        option.bool("55794", "Gatot Mace", 'Mode: [select] only\nShould the bot buy "Gatot Mace" ?', false),
        option.bool(
            "94987",
            "Sovereign Ceremonial Mace",
            'Mode: [select] only\nShould the bot buy "Sovereign Ceremonial Mace" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RangdaMerge.select,
});

export default function main(): void {
    const script = new RangdaMerge();
    Core.bankingBlackList.push(
        "Abhorrent Remnant",
        "Batik Fabric",
        "Benang",
        "Duskwind Warok Visage",
        "Elder Warok Morph",
        "Gendeng's Wild Axe",
        "Gendeng's Wild Hammer",
        "Ocean Maiden's Locks",
        "Rangda's Mask",
        "Southern King Hair",
        "Warok's Wicked Snapper",
    );
    Core.setOptions();
    script.buyAllMerge();
    Core.setOptions(false);
}
