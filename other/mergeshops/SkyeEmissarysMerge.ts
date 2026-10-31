/*
name: Skye Emissarys Merge
description: This bot will farm the items belonging to the selected mode for the Skye Emissarys Merge [2441] in /balemorale
tags: skye, emissarys, merge, balemorale, gold, voucher, k, halcyon, virtue, scepter, coronation, electrowave, scholar, shockwave, morph, scholars, ac, royal, dc, paralyzer, bow, longsword, longswords, hand
*/
// Port of Scripts/Other/MergeShops/SkyeEmissarysMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SkyeEmissarysMerge {
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
                case "Pristine Deepsea Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9718);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("ashray", "Enter", "Spawn", "*", "Deepsea Pearls", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Deepdark Pearl":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9715);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("midnightzone", "Shadow Viscera", "Viscera Sample", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Electrojolt Scholar":

                case "Royal Electrojolt Scholar":
                    Adv.buyItem("balemorale", 2443, req.name, quant);
                    break;
                case "Tattered Court Mage Robe":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("balemorale", "Chaos Crystal", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Victoria's Fletching":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("balemorale", "Queen Victoria", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("balemorale", 2441, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "67387",
            "Halcyon Virtue Blade",
            'Mode: [select] only\nShould the bot buy "Halcyon Virtue Blade" ?',
            false,
        ),
        option.bool(
            "67388",
            "Halcyon Virtue Blades",
            'Mode: [select] only\nShould the bot buy "Halcyon Virtue Blades" ?',
            false,
        ),
        option.bool(
            "85944",
            "Halcyon Skye Blade",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Blade" ?',
            false,
        ),
        option.bool(
            "85945",
            "Halcyon Skye Blades",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Blades" ?',
            false,
        ),
        option.bool(
            "85942",
            "Halcyon Virtue Scepter",
            'Mode: [select] only\nShould the bot buy "Halcyon Virtue Scepter" ?',
            false,
        ),
        option.bool(
            "85943",
            "Halcyon Skye Scepter",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Scepter" ?',
            false,
        ),
        option.bool(
            "85948",
            "Halcyon Virtue Axe",
            'Mode: [select] only\nShould the bot buy "Halcyon Virtue Axe" ?',
            false,
        ),
        option.bool(
            "85949",
            "Halcyon Virtue Axes",
            'Mode: [select] only\nShould the bot buy "Halcyon Virtue Axes" ?',
            false,
        ),
        option.bool("67397", "Halcyon Skye Axe", 'Mode: [select] only\nShould the bot buy "Halcyon Skye Axe" ?', false),
        option.bool(
            "67398",
            "Halcyon Skye Axes",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Axes" ?',
            false,
        ),
        option.bool(
            "85950",
            "Halcyon Coronation Axe",
            'Mode: [select] only\nShould the bot buy "Halcyon Coronation Axe" ?',
            false,
        ),
        option.bool(
            "85951",
            "Halcyon Coronation Axes",
            'Mode: [select] only\nShould the bot buy "Halcyon Coronation Axes" ?',
            false,
        ),
        option.bool(
            "85876",
            "Electrowave Scholar",
            'Mode: [select] only\nShould the bot buy "Electrowave Scholar" ?',
            false,
        ),
        option.bool(
            "85878",
            "Shockwave Scholar",
            'Mode: [select] only\nShould the bot buy "Shockwave Scholar" ?',
            false,
        ),
        option.bool(
            "85879",
            "Electrowave Scholar Morph",
            'Mode: [select] only\nShould the bot buy "Electrowave Scholar Morph" ?',
            false,
        ),
        option.bool(
            "85883",
            "Scholar's AC Gauntlet",
            'Mode: [select] only\nShould the bot buy "Scholar\'s AC Gauntlet" ?',
            false,
        ),
        option.bool(
            "85885",
            "Royal Electrowave Scholar",
            'Mode: [select] only\nShould the bot buy "Royal Electrowave Scholar" ?',
            false,
        ),
        option.bool(
            "85887",
            "Royal Shockwave Scholar",
            'Mode: [select] only\nShould the bot buy "Royal Shockwave Scholar" ?',
            false,
        ),
        option.bool(
            "85888",
            "Royal Electrowave Scholar Morph",
            'Mode: [select] only\nShould the bot buy "Royal Electrowave Scholar Morph" ?',
            false,
        ),
        option.bool(
            "85892",
            "Scholar's DC Gauntlet",
            'Mode: [select] only\nShould the bot buy "Scholar\'s DC Gauntlet" ?',
            false,
        ),
        option.bool(
            "85893",
            "Shockwave Paralyzer Bow",
            'Mode: [select] only\nShould the bot buy "Shockwave Paralyzer Bow" ?',
            false,
        ),
        option.bool(
            "67389",
            "Halcyon Skye Longsword",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Longsword" ?',
            false,
        ),
        option.bool(
            "67390",
            "Halcyon Skye Longswords",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Longswords" ?',
            false,
        ),
        option.bool(
            "67395",
            "Halcyon Skye Hand Axe",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Hand Axe" ?',
            false,
        ),
        option.bool(
            "67396",
            "Halcyon Skye Hand Axes",
            'Mode: [select] only\nShould the bot buy "Halcyon Skye Hand Axes" ?',
            false,
        ),
        option.bool(
            "86005",
            "Scholar's AC Gauntlets",
            'Mode: [select] only\nShould the bot buy "Scholar\'s AC Gauntlets" ?',
            false,
        ),
        option.bool(
            "86006",
            "Scholar's DC Gauntlets",
            'Mode: [select] only\nShould the bot buy "Scholar\'s DC Gauntlets" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SkyeEmissarysMerge.select,
});

export default function main(): void {
    const script = new SkyeEmissarysMerge();
    Core.bankingBlackList.push(
        "Pristine Deepsea Pearl",
        "Deepdark Pearl",
        "Electrojolt Scholar",
        "Tattered Court Mage Robe",
        "Victoria's Fletching",
        "Royal Electrojolt Scholar",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
