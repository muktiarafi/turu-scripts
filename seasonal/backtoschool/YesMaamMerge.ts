/*
name: Yes Ma'am Merge
description: This bot will farm the items belonging to the selected mode for the Yes Ma'am / 1st Grade Merge [2749] in /extracredit
tags: back-to-school, yes maam, 1st grade, merge, extracredit, beat breaker, beatbox, whyphone, selfie, primo, pro, boss, based, ace, cosmo buns
*/
// Port of Scripts/Seasonal/BackToSchool/YesMaamMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { YesMaam } from "./YesMaam";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Chain = new YesMaam();

export class YesMaamMerge {
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
                // All of these drop from Mind-Controlled Porkon (perma inv items)
                case "1st Grade School Supplies":

                case "Beatbox Boombox":

                case "Golden WHYphone":

                case "Golden WHYphones":

                case "Old School Selfie Device":

                case "Cool Beat Breaker Visage":

                case "Beat Breaker Beanie Morph":

                case "Beat Breaker Beanie Visage":

                case "Beat Breaker Cap Morph":

                case "Beat Breaker Cap Visage":

                case "Ace Beat Breaker Morph":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("extracredit", "r6", "Left", "Mind-Controlled Porkon", req.name, quant, {
                        isTemp: false,
                    });
                    break;
                case "Golden Apple":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8793);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extracredit", "Dogear", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Gold Voucher 25k":
                    Farm.voucher(req.name, quant);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("extracredit")) {
            return;
        }

        // The shop only unlocks once the 'Yes Ma'am!' test chain is done
        if (!Core.isCompletedBefore(10823)) {
            Core.logger("'Yes Ma'am!' test chain not complete, doing it first.");
            Chain.doChain();
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("extracredit", 2749, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("101208", "Beat Breaker", 'Mode: [select] only\nShould the bot buy "Beat Breaker" ?', false),
        option.bool(
            "101230",
            "Primo Beat Breaker",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker" ?',
            false,
        ),
        option.bool(
            "101223",
            "Beatbox Boomboxes",
            'Mode: [select] only\nShould the bot buy "Beatbox Boomboxes" ?',
            false,
        ),
        option.bool(
            "101227",
            "Golden WHYphone Ultras",
            'Mode: [select] only\nShould the bot buy "Golden WHYphone Ultras" ?',
            false,
        ),
        option.bool(
            "101229",
            "Old School Selfie Devices",
            'Mode: [select] only\nShould the bot buy "Old School Selfie Devices" ?',
            false,
        ),
        option.bool(
            "101209",
            "Pro Beat Breaker Morph",
            'Mode: [select] only\nShould the bot buy "Pro Beat Breaker Morph" ?',
            false,
        ),
        option.bool(
            "101210",
            "Pro Beat Breaker Visage",
            'Mode: [select] only\nShould the bot buy "Pro Beat Breaker Visage" ?',
            false,
        ),
        option.bool(
            "101211",
            "Boss Beat Breaker Morph",
            'Mode: [select] only\nShould the bot buy "Boss Beat Breaker Morph" ?',
            false,
        ),
        option.bool(
            "101213",
            "Based Beat Breaker Morph",
            'Mode: [select] only\nShould the bot buy "Based Beat Breaker Morph" ?',
            false,
        ),
        option.bool(
            "101214",
            "Boss Beat Breaker Visage",
            'Mode: [select] only\nShould the bot buy "Boss Beat Breaker Visage" ?',
            false,
        ),
        option.bool(
            "101218",
            "Ace Beat Breaker Visage",
            'Mode: [select] only\nShould the bot buy "Ace Beat Breaker Visage" ?',
            false,
        ),
        option.bool(
            "101235",
            "Top Beat Breaker Shades",
            'Mode: [select] only\nShould the bot buy "Top Beat Breaker Shades" ?',
            false,
        ),
        option.bool(
            "101236",
            "Cosmo Buns Shades",
            'Mode: [select] only\nShould the bot buy "Cosmo Buns Shades" ?',
            false,
        ),
        option.bool(
            "101237",
            "Primo Beat Breaker Visage",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Visage" ?',
            false,
        ),
        option.bool(
            "101238",
            "Primo Beat Breaker Morph",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Morph" ?',
            false,
        ),
        option.bool(
            "101239",
            "Primo Beat Breaker Beanie",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Beanie" ?',
            false,
        ),
        option.bool(
            "101240",
            "Primo Beat Breaker Beanie Shades",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Beanie Shades" ?',
            false,
        ),
        option.bool(
            "101241",
            "Primo Beat Breaker Beanie Cap",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Beanie Cap" ?',
            false,
        ),
        option.bool(
            "101242",
            "Top Beat Breaker Beanie",
            'Mode: [select] only\nShould the bot buy "Top Beat Breaker Beanie" ?',
            false,
        ),
        option.bool(
            "101243",
            "Primo Beat Breaker Cap Visage",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Cap Visage" ?',
            false,
        ),
        option.bool(
            "101244",
            "Primo Beat Breaker Cap",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Cap" ?',
            false,
        ),
        option.bool(
            "101245",
            "Primo Beat Breaker Shades",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Shades" ?',
            false,
        ),
        option.bool(
            "101246",
            "Primo Beat Breaker Cap Morph",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Cap Morph" ?',
            false,
        ),
        option.bool(
            "101247",
            "Primo Beat Breaker Hat Visage",
            'Mode: [select] only\nShould the bot buy "Primo Beat Breaker Hat Visage" ?',
            false,
        ),
        option.bool(
            "101226",
            "Golden WHYphone Ultra",
            'Mode: [select] only\nShould the bot buy "Golden WHYphone Ultra" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YesMaamMerge.select,
});

export default function main(): void {
    const script = new YesMaamMerge();
    Core.bankingBlackList.push(
        "1st Grade School Supplies",
        "Golden Apple",
        "Beatbox Boombox",
        "Golden WHYphones",
        "Old School Selfie Device",
        "Ace Beat Breaker Morph",
        "Beat Breaker Beanie Visage",
        "Beat Breaker Cap Morph",
        "Beat Breaker Beanie Morph",
        "Beat Breaker Cap Visage",
        "Cool Beat Breaker Visage",
        "Golden WHYphone",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
