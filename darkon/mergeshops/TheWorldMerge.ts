/*
name: The World Merge
description: The World Merge
tags: darkon, theworld, song rivale, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/TheWorldMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class TheWorldMerge {
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
                case "Unfinished Musical Score":
                    Darkon.unfinishedMusicalScore(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("theworld", 2141, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70876",
            "Darkon's Debris 1",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 1" ?',
            false,
        ),
        option.bool(
            "70879",
            "Darkon's Debris 2 (Recovered)",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Debris 2 (Recovered)" ?',
            false,
        ),
        option.bool("70877", "Darkon's Hair", 'Mode: [select] only\nShould the bot buy "Darkon\'s Hair" ?', false),
        option.bool("70878", "Darkon's Morph", 'Mode: [select] only\nShould the bot buy "Darkon\'s Morph" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TheWorldMerge.select,
});

export default function main(): void {
    const script = new TheWorldMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
