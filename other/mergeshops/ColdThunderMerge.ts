/*
name: ColdThunder Merge
description: This bot will farm the items belonging to the selected mode for the ColdThunder Merge [2467] in /coldthunder
tags: coldthunder, merge, coldthunder, thundersnow, demigod, morph, ruler, demigods, divine, scathanna, eyes, shadow, veil, skyes, wailing, greatsword, storm, scythe, hand, winter, hands, skye, emissary, queen, ionas, royal, attire, electrifying, summer, zilla, shades, visor, tote, bag, chibi, greatswords
*/
// Port of Scripts/Other/MergeShops/ColdThunderMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const coreAOR = new CoreAOR();

export class ColdThunderMerge {
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
                case "Skye's Lightning":
                    Core.farmingLogger(req.name, quant);
                    // 9834 | Eilean a' Cheò
                    Core.registerQuests(9834);
                    coreAOR.coldThunderBoss(req.name, quant, req.temp);
                    bot.wait.forPickup("Skye's Lightning");
                    break;
                case "Electrifying Zilla Tail":

                case "Electrifying Zilla Bag":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("castlegaheris", "Energy Elemental", req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        coreAOR.coldThunder();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("coldthunder", 2467, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "87430",
            "Thundersnow Demigod",
            'Mode: [select] only\nShould the bot buy "Thundersnow Demigod" ?',
            false,
        ),
        option.bool(
            "87431",
            "Thundersnow Demigod Morph",
            'Mode: [select] only\nShould the bot buy "Thundersnow Demigod Morph" ?',
            false,
        ),
        option.bool(
            "87432",
            "Thundersnow Demigod Visage",
            'Mode: [select] only\nShould the bot buy "Thundersnow Demigod Visage" ?',
            false,
        ),
        option.bool(
            "87433",
            "Thundersnow Ruler Morph",
            'Mode: [select] only\nShould the bot buy "Thundersnow Ruler Morph" ?',
            false,
        ),
        option.bool(
            "87434",
            "Thundersnow Ruler Visage",
            'Mode: [select] only\nShould the bot buy "Thundersnow Ruler Visage" ?',
            false,
        ),
        option.bool(
            "87435",
            "Thundersnow Ruler Hair",
            'Mode: [select] only\nShould the bot buy "Thundersnow Ruler Hair" ?',
            false,
        ),
        option.bool(
            "87436",
            "Thundersnow Ruler Locks",
            'Mode: [select] only\nShould the bot buy "Thundersnow Ruler Locks" ?',
            false,
        ),
        option.bool(
            "87437",
            "Demigod's Divine Scathanna",
            'Mode: [select] only\nShould the bot buy "Demigod\'s Divine Scathanna" ?',
            false,
        ),
        option.bool(
            "87438",
            "Divine Eyes of Scathanna",
            'Mode: [select] only\nShould the bot buy "Divine Eyes of Scathanna" ?',
            false,
        ),
        option.bool(
            "87439",
            "Demigod's Shadow Veil",
            'Mode: [select] only\nShould the bot buy "Demigod\'s Shadow Veil" ?',
            false,
        ),
        option.bool(
            "87449",
            "Demigod's Scathanna",
            'Mode: [select] only\nShould the bot buy "Demigod\'s Scathanna" ?',
            false,
        ),
        option.bool(
            "87440",
            "Skye's Wailing Greatsword",
            'Mode: [select] only\nShould the bot buy "Skye\'s Wailing Greatsword" ?',
            false,
        ),
        option.bool(
            "87442",
            "Divine Storm Scythe",
            'Mode: [select] only\nShould the bot buy "Divine Storm Scythe" ?',
            false,
        ),
        option.bool("87443", "Hand of Winter", 'Mode: [select] only\nShould the bot buy "Hand of Winter" ?', false),
        option.bool("87444", "Hands of Winter", 'Mode: [select] only\nShould the bot buy "Hands of Winter" ?', false),
        option.bool("87424", "Skye Emissary", 'Mode: [select] only\nShould the bot buy "Skye Emissary" ?', false),
        option.bool(
            "87425",
            "Skye Emissary Morph",
            'Mode: [select] only\nShould the bot buy "Skye Emissary Morph" ?',
            false,
        ),
        option.bool(
            "87426",
            "Skye Emissary Hair",
            'Mode: [select] only\nShould the bot buy "Skye Emissary Hair" ?',
            false,
        ),
        option.bool(
            "87427",
            "Queen Iona's Royal Attire",
            'Mode: [select] only\nShould the bot buy "Queen Iona\'s Royal Attire" ?',
            false,
        ),
        option.bool(
            "87428",
            "Queen Iona's Visage",
            'Mode: [select] only\nShould the bot buy "Queen Iona\'s Visage" ?',
            false,
        ),
        option.bool(
            "87429",
            "Queen Iona's Locks",
            'Mode: [select] only\nShould the bot buy "Queen Iona\'s Locks" ?',
            false,
        ),
        option.bool(
            "87113",
            "Electrifying Summer Zilla",
            'Mode: [select] only\nShould the bot buy "Electrifying Summer Zilla" ?',
            false,
        ),
        option.bool(
            "87114",
            "Electrifying Zilla Shades Visage",
            'Mode: [select] only\nShould the bot buy "Electrifying Zilla Shades Visage" ?',
            false,
        ),
        option.bool(
            "87115",
            "Electrifying Summer Zilla Visage",
            'Mode: [select] only\nShould the bot buy "Electrifying Summer Zilla Visage" ?',
            false,
        ),
        option.bool(
            "87116",
            "Electrifying Zilla Visor Visage",
            'Mode: [select] only\nShould the bot buy "Electrifying Zilla Visor Visage" ?',
            false,
        ),
        option.bool(
            "87119",
            "Electrifying Zilla Tote Bag",
            'Mode: [select] only\nShould the bot buy "Electrifying Zilla Tote Bag" ?',
            false,
        ),
        option.bool(
            "87120",
            "Electrifying Zilla Summer Chibi",
            'Mode: [select] only\nShould the bot buy "Electrifying Zilla Summer Chibi" ?',
            false,
        ),
        option.bool(
            "87441",
            "Skye's Wailing Greatswords",
            'Mode: [select] only\nShould the bot buy "Skye\'s Wailing Greatswords" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ColdThunderMerge.select,
});

export default function main(): void {
    const script = new ColdThunderMerge();
    Core.bankingBlackList.push("Skye's Lightning", "Electrifying Zilla Tail", "Electrifying Zilla Bag");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
