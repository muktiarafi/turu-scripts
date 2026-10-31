/*
name: Hollowborn Judgement Merge
description: This bot will farm the items belonging to the selected mode for the Hollowborn Judgement Merge [2075] in /hbchallenge
tags: hollowborn, judgement, merge, hbchallenge, judge, in, officio, hel, fö, fös, crown, band, morph, judges, altare, devotionis, aequitas, judicii, dark, judicium, imaginem, jurisdictio, ex, vi, legis, punitio, virgam, luminum, consummatum, est, bis, idem, remissio, vade, mecum, lex, et, ordo
*/
// Port of Scripts/Hollowborn/MergeShops/HBJudgementMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HBJudgementMerge {
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
                case "Hollowborn Writ":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8418);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("hbchallenge", "r3", "Right", "Judge's Minion", "Judge's Minion Judged", 12);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("hbchallenge", 2075, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "65728",
            "Hollowborn Judge In Officio",
            'Mode: [select] only\nShould the bot buy "Hollowborn Judge In Officio" ?',
            false,
        ),
        option.bool("65729", "Hollowborn Judge", 'Mode: [select] only\nShould the bot buy "Hollowborn Judge" ?', false),
        option.bool(
            "65730",
            "Hel Fö In Officio",
            'Mode: [select] only\nShould the bot buy "Hel Fö In Officio" ?',
            false,
        ),
        option.bool("65731", "Hel Fö's Armor", 'Mode: [select] only\nShould the bot buy "Hel Fö\'s Armor" ?', false),
        option.bool(
            "65732",
            "Hel Fö's Crown + Band",
            'Mode: [select] only\nShould the bot buy "Hel Fö\'s Crown + Band" ?',
            false,
        ),
        option.bool("65733", "Hel Fö's Morph", 'Mode: [select] only\nShould the bot buy "Hel Fö\'s Morph" ?', false),
        option.bool(
            "65734",
            "Hel Fö's Morph + Band",
            'Mode: [select] only\nShould the bot buy "Hel Fö\'s Morph + Band" ?',
            false,
        ),
        option.bool("65735", "Hel Fö's Hair", 'Mode: [select] only\nShould the bot buy "Hel Fö\'s Hair" ?', false),
        option.bool(
            "65736",
            "Hollowborn Judge's Hood",
            'Mode: [select] only\nShould the bot buy "Hollowborn Judge\'s Hood" ?',
            false,
        ),
        option.bool("65737", "Hel Fö's Hat", 'Mode: [select] only\nShould the bot buy "Hel Fö\'s Hat" ?', false),
        option.bool(
            "65738",
            "Hollowborn Altare Devotionis",
            'Mode: [select] only\nShould the bot buy "Hollowborn Altare Devotionis" ?',
            false,
        ),
        option.bool(
            "65739",
            "Hollowborn Aequitas",
            'Mode: [select] only\nShould the bot buy "Hollowborn Aequitas" ?',
            false,
        ),
        option.bool(
            "65740",
            "Hollowborn Rune Judicii",
            'Mode: [select] only\nShould the bot buy "Hollowborn Rune Judicii" ?',
            false,
        ),
        option.bool(
            "65741",
            "Hollowborn Dark Rune Judicii",
            'Mode: [select] only\nShould the bot buy "Hollowborn Dark Rune Judicii" ?',
            false,
        ),
        option.bool(
            "65742",
            "Hollowborn Judicium Imaginem",
            'Mode: [select] only\nShould the bot buy "Hollowborn Judicium Imaginem" ?',
            false,
        ),
        option.bool(
            "65743",
            "Hollowborn Jurisdictio",
            'Mode: [select] only\nShould the bot buy "Hollowborn Jurisdictio" ?',
            false,
        ),
        option.bool(
            "65744",
            "Hollowborn Judgement Ex Vi Legis",
            'Mode: [select] only\nShould the bot buy "Hollowborn Judgement Ex Vi Legis" ?',
            false,
        ),
        option.bool(
            "65745",
            "Dual Hollowborn Judgement",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Judgement" ?',
            false,
        ),
        option.bool(
            "65746",
            "Hollowborn Punitio",
            'Mode: [select] only\nShould the bot buy "Hollowborn Punitio" ?',
            false,
        ),
        option.bool(
            "65747",
            "Dual Hollowborn Punitio",
            'Mode: [select] only\nShould the bot buy "Dual Hollowborn Punitio" ?',
            false,
        ),
        option.bool(
            "65748",
            "Hollowborn Virgam Luminum",
            'Mode: [select] only\nShould the bot buy "Hollowborn Virgam Luminum" ?',
            false,
        ),
        option.bool(
            "65749",
            "Hollowborn Consummatum Est",
            'Mode: [select] only\nShould the bot buy "Hollowborn Consummatum Est" ?',
            false,
        ),
        option.bool(
            "65750",
            "Hollowborn Bis In Idem",
            'Mode: [select] only\nShould the bot buy "Hollowborn Bis In Idem" ?',
            false,
        ),
        option.bool(
            "65751",
            "Hollowborn Remissio",
            'Mode: [select] only\nShould the bot buy "Hollowborn Remissio" ?',
            false,
        ),
        option.bool(
            "65752",
            "Hollowborn Vade Mecum",
            'Mode: [select] only\nShould the bot buy "Hollowborn Vade Mecum" ?',
            false,
        ),
        option.bool(
            "65753",
            "Hollowborn Lex et Ordo",
            'Mode: [select] only\nShould the bot buy "Hollowborn Lex et Ordo" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HBJudgementMerge.select,
});

export default function main(): void {
    const script = new HBJudgementMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
