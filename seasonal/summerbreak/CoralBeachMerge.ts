/*
name: Coral Beach Merge
description: This will farm the Coral Beach items.
tags: farm, merge, shop, coral-beach, summer-break
*/
// Port of Scripts/Seasonal/SummerBreak/CoralBeachMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CoralBeachMerge {
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
                case "Moon Rock Fragments":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("lunacove", "r2", "Right", "*", req.name, quant, { isTemp: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("coralbeach")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("coralbeach", 79, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("30267", "Chillin Cap", 'Mode: [select] only\nShould the bot buy "Chillin Cap" ?', false),
        option.bool("30268", "Salty Cap", 'Mode: [select] only\nShould the bot buy "Salty Cap" ?', false),
        option.bool("30269", "Burnin' Cap", 'Mode: [select] only\nShould the bot buy "Burnin\' Cap" ?', false),
        option.bool(
            "30270",
            "Burnin' Cap and Glasses",
            'Mode: [select] only\nShould the bot buy "Burnin\' Cap and Glasses" ?',
            false,
        ),
        option.bool("30272", "Air Tank", 'Mode: [select] only\nShould the bot buy "Air Tank" ?', false),
        option.bool("30273", "Diving Gear", 'Mode: [select] only\nShould the bot buy "Diving Gear" ?', false),
        option.bool("30274", "Snorkel Mask", 'Mode: [select] only\nShould the bot buy "Snorkel Mask" ?', false),
        option.bool(
            "30276",
            "Shady Sunhat and Glasses",
            'Mode: [select] only\nShould the bot buy "Shady Sunhat and Glasses" ?',
            false,
        ),
        option.bool("30277", "Floppy Beach Hat", 'Mode: [select] only\nShould the bot buy "Floppy Beach Hat" ?', false),
        option.bool("30278", "Sassy Sunhat", 'Mode: [select] only\nShould the bot buy "Sassy Sunhat" ?', false),
        option.bool("30279", "Sunny", 'Mode: [select] only\nShould the bot buy "Sunny" ?', false),
        option.bool("30280", "Lazy Summertime", 'Mode: [select] only\nShould the bot buy "Lazy Summertime" ?', false),
        option.bool(
            "30283",
            "Snazzy Umbrella Lance",
            'Mode: [select] only\nShould the bot buy "Snazzy Umbrella Lance" ?',
            false,
        ),
        option.bool(
            "30284",
            "Orange Water Balloon",
            'Mode: [select] only\nShould the bot buy "Orange Water Balloon" ?',
            false,
        ),
        option.bool(
            "30285",
            "Green Water Balloon",
            'Mode: [select] only\nShould the bot buy "Green Water Balloon" ?',
            false,
        ),
        option.bool(
            "30286",
            "Pink Water Balloon",
            'Mode: [select] only\nShould the bot buy "Pink Water Balloon" ?',
            false,
        ),
        option.bool(
            "30281",
            "Slammin' Swimwear",
            'Mode: [select] only\nShould the bot buy "Slammin\' Swimwear" ?',
            false,
        ),
        option.bool(
            "30287",
            "Snorkel Mask Ponytail",
            'Mode: [select] only\nShould the bot buy "Snorkel Mask Ponytail" ?',
            false,
        ),
        option.bool(
            "30282",
            "Beach Umbrella Lance",
            'Mode: [select] only\nShould the bot buy "Beach Umbrella Lance" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CoralBeachMerge.select,
});

export default function main(): void {
    const script = new CoralBeachMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
