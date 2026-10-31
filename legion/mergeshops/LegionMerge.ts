/*
name: Legion Merge
description: This bot will farm the items belonging to the selected mode for the Legion Merge [1207] in /shadowblast
tags: legion, merge, shadowblast, executioner, evolved, soul, mender, soulstealer
*/
// Port of Scripts/Legion/MergeShops/LegionMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class LegionMerge {
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
                case "Emblem of Dage":
                    Legion.emblemofDage(quant);
                    break;
                case "Diamond Token of Dage":
                    Legion.diamondTokenofDage(quant);
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowblast", 1207, findIngredients, buyOnlyThis, { buyMode, group: "Last" });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "33153",
            "Evolved Soul Mender",
            'Mode: [select] only\nShould the bot buy "Evolved Soul Mender" ?',
            false,
        ),
        option.bool(
            "33163",
            "Legion Executioner",
            'Mode: [select] only\nShould the bot buy "Legion Executioner"\n[Emblemof Dage/Diamond Token] ?',
            false,
        ),
        option.bool(
            "33173",
            "Legion Soulstealer",
            'Mode: [select] only\nShould the bot buy "Legion Soulstealer"\n[Emblemof Dage/Diamond Token]  ?',
            false,
        ),
        option.bool(
            "33175",
            "Legion Soulstealer Hair",
            'Mode: [select] only\nShould the bot buy "Legion Soulstealer Hair"\n[Emblemof Dage/Diamond Token]  ?',
            false,
        ),
        option.bool(
            "33174",
            "Legion Soulstealer Locks",
            'Mode: [select] only\nShould the bot buy "Legion Soulstealer Locks"\n[Emblemof Dage/Diamond Token]  ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LegionMerge.select,
});

export default function main(): void {
    const script = new LegionMerge();
    Core.bankingBlackList.push("Emblem of Dage", "Diamond Token of Dage", "Legion Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
