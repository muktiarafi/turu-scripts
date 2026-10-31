/*
name: Strangers Merge
description: This bot will farm the items belonging to the selected mode for the Strangers Merge [464] in /evilwardage
tags: strangers, merge, evilwardage, skullborne, stranger, house, guard
*/
// Port of Scripts/Legion/MergeShops/StrangersMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class StrangersMerge {
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
                case "Dage's Favor":
                    Legion.approvalAndFavor(0, quant);
                    break;
                case "Dage's Approval":
                    Legion.approvalAndFavor(quant, 0);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("evilwardage", 464, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("29582", "SkullBorne Axe", 'Mode: [select] only\nShould the bot buy "SkullBorne Axe" ?', false),
        option.bool(
            "92252",
            "The Stranger House Guard",
            'Mode: [select] only\nShould the bot buy "The Stranger House Guard" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: StrangersMerge.select,
});

export default function main(): void {
    const script = new StrangersMerge();
    Core.bankingBlackList.push("Dage's Favor", "Dage's Approval");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
