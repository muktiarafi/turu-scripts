/*
name: First Observatory Merge
description: First Observatory Merge
tags: firstobservatory, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/FirstObservatoryMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class FirstObservatoryMerge {
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
                case "Ancient Remnant":
                    Darkon.ancientRemnant(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("firstobservatory", 2130, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("69703", "Aurola's Armor", 'Mode: [select] only\nShould the bot buy "Aurola\'s Armor" ?', false),
        option.bool("69704", "Aurola's Coat", 'Mode: [select] only\nShould the bot buy "Aurola\'s Coat" ?', false),
        option.bool(
            "69705",
            "Princess Suki's Armor",
            'Mode: [select] only\nShould the bot buy "Princess Suki\'s Armor" ?',
            false,
        ),
        option.bool(
            "69706",
            "Princess Suki's Cut",
            'Mode: [select] only\nShould the bot buy "Princess Suki\'s Cut" ?',
            false,
        ),
        option.bool(
            "69707",
            "Princess Suki's Hair",
            'Mode: [select] only\nShould the bot buy "Princess Suki\'s Hair" ?',
            false,
        ),
        option.bool(
            "69708",
            "Princess Suki's Morph",
            'Mode: [select] only\nShould the bot buy "Princess Suki\'s Morph" ?',
            false,
        ),
        option.bool(
            "69709",
            "Princess Suki's Gauntlets",
            'Mode: [select] only\nShould the bot buy "Princess Suki\'s Gauntlets" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FirstObservatoryMerge.select,
});

export default function main(): void {
    const script = new FirstObservatoryMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
