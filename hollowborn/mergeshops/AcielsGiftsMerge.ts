/*
name: Aciels Gifts Merge
description: This bot will farm the items belonging to the selected mode for the Aciels Gifts Merge [2680] in /shadowrealm
tags: aciels, gifts, merge, shadowrealm, hollow, hail, next, week, ac, items
*/
// Port of Scripts/Hollowborn/MergeShops/AcielsGiftsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { HollowSoul } from "../materials/HollowSoul";

const Adv = new CoreAdvanced();
const HS = new HollowSoul();

export class AcielsGiftsMerge {
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
                //#region Known items
                case "Hollow Soul":
                    HS.getYaSoulsHeeeere(quant);
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowrealm", 2680, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("97816", "The Hollow Hail", 'Mode: [select] only\nShould the bot buy "The Hollow Hail" ?', false),
        option.bool(
            "99376",
            "Next Week: AC Items",
            'Mode: [select] only\nShould the bot buy "Next Week: AC Items" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AcielsGiftsMerge.select,
});

export default function main(): void {
    const script = new AcielsGiftsMerge();
    Core.bankingBlackList.push("Hollow Soul");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
