/*
name: Eridani Past merge
description: Eridani Past merge
tags: eridani past, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/EridaniPastMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class EridaniPastMerge {
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
                case "Bandit's Correspondence":
                    Darkon.banditsCorrespondence(quant);
                    break;
                case "Suki's Sword":
                    Core.huntMonsterMapID("eridanipast", 19, req.name, undefined, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("eridanipast", 2112, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("67959", "Bandit Armor", 'Mode: [select] only\nShould the bot buy "Bandit Armor" ?', false),
        option.bool(
            "67953",
            "Aurola's Casual Wear",
            'Mode: [select] only\nShould the bot buy "Aurola\'s Casual Wear" ?',
            false,
        ),
        option.bool("67954", "Aurola's Hair", 'Mode: [select] only\nShould the bot buy "Aurola\'s Hair" ?', false),
        option.bool("67955", "Aurola's Morph", 'Mode: [select] only\nShould the bot buy "Aurola\'s Morph" ?', false),
        option.bool(
            "67956",
            "Darkon's Casual Wear",
            'Mode: [select] only\nShould the bot buy "Darkon\'s Casual Wear" ?',
            false,
        ),
        option.bool(
            "67957",
            "Prince Darkon's Hair",
            'Mode: [select] only\nShould the bot buy "Prince Darkon\'s Hair" ?',
            false,
        ),
        option.bool(
            "67958",
            "Prince Darkon's Morph",
            'Mode: [select] only\nShould the bot buy "Prince Darkon\'s Morph" ?',
            false,
        ),
        option.bool(
            "67966",
            "Astravian Secretary",
            'Mode: [select] only\nShould the bot buy "Astravian Secretary" ?',
            false,
        ),
        option.bool(
            "67967",
            "Astravian Royal Secretary",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Secretary" ?',
            false,
        ),
        option.bool(
            "67968",
            "Astravian Secretary Cut",
            'Mode: [select] only\nShould the bot buy "Astravian Secretary Cut" ?',
            false,
        ),
        option.bool(
            "67969",
            "Astravian Secretary Hair",
            'Mode: [select] only\nShould the bot buy "Astravian Secretary Hair" ?',
            false,
        ),
        option.bool(
            "67970",
            "Astravian Secretary Cut + Glasses",
            'Mode: [select] only\nShould the bot buy "Astravian Secretary Cut + Glasses" ?',
            false,
        ),
        option.bool(
            "67971",
            "Astravian Secretary Hair + Glasses",
            'Mode: [select] only\nShould the bot buy "Astravian Secretary Hair + Glasses" ?',
            false,
        ),
        option.bool(
            "67965",
            "Suki's Seraphic Sword",
            'Mode: [select] only\nShould the bot buy "Suki\'s Seraphic Sword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EridaniPastMerge.select,
});

export default function main(): void {
    const script = new EridaniPastMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
