/*
name: Eridani merge
description: Eridani merge
tags: eridani, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/EridaniMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class EridaniMerge {
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
                case "Teeth":
                    Darkon.teeth(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("eridani", 1912, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("57268", "Re's Attire", 'Mode: [select] only\nShould the bot buy "Re\'s Attire" ?', false),
        option.bool("57277", "Re's Morph", 'Mode: [select] only\nShould the bot buy "Re\'s Morph" ?', false),
        option.bool("57278", "Re's Shades", 'Mode: [select] only\nShould the bot buy "Re\'s Shades" ?', false),
        option.bool(
            "57292",
            "Re's Sharp Edges Arsenal",
            'Mode: [select] only\nShould the bot buy "Re\'s Sharp Edges Arsenal" ?',
            false,
        ),
        option.bool(
            "57293",
            "Re's Short Stabbers",
            'Mode: [select] only\nShould the bot buy "Re\'s Short Stabbers" ?',
            false,
        ),
        option.bool(
            "57294",
            "Re's Giant Slicers",
            'Mode: [select] only\nShould the bot buy "Re\'s Giant Slicers" ?',
            false,
        ),
        option.bool(
            "57295",
            "Re's Face Masher",
            'Mode: [select] only\nShould the bot buy "Re\'s Face Masher" ?',
            false,
        ),
        option.bool(
            "57297",
            "Re's Neck Snatcher",
            'Mode: [select] only\nShould the bot buy "Re\'s Neck Snatcher" ?',
            false,
        ),
        option.bool(
            "57298",
            "Re's Long Stabber",
            'Mode: [select] only\nShould the bot buy "Re\'s Long Stabber" ?',
            false,
        ),
        option.bool(
            "57300",
            "Re's Sharp Cutter",
            'Mode: [select] only\nShould the bot buy "Re\'s Sharp Cutter" ?',
            false,
        ),
        option.bool(
            "57302",
            "Re's Absolute Annihilator",
            'Mode: [select] only\nShould the bot buy "Re\'s Absolute Annihilator" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EridaniMerge.select,
});

export default function main(): void {
    const script = new EridaniMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
