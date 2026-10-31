/*
name: The World House Merge
description: The World House Merge
tags: darkon, ultradarkon, theworld, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/TheWorldHouseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class TheWorldHouseMerge {
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
                case "Darkon's Receipt":
                    Darkon.farmReceipt(quant);
                    break;
                case "Teeth":
                    Darkon.teeth(quant);
                    break;
                case "La's Gratitude":
                    Darkon.lasGratitude(quant);
                    break;
                case "Astravian Medal":
                    Darkon.astravianMedal(quant);
                    break;
                case "A Melody":
                    Darkon.aMelody(quant);
                    break;
                case "Bandit's Correspondence":
                    Darkon.banditsCorrespondence(quant);
                    break;
                case "Suki's Prestige":
                    Darkon.sukisPrestiege(quant);
                    break;
                case "Ancient Remnant":
                    Darkon.ancientRemnant(quant);
                    break;
                case "Mourning Flower":
                    Darkon.wheelofFortune(quant, 0);
                    break;
                case "Unfinished Musical Score":
                    Darkon.unfinishedMusicalScore(quant);
                    break;
                case "Darkon's Instant Noodle":
                    Adv.buyItem("garden", 1831, req.name, quant);
                    break;
                case "Astravia Castle House":
                    Core.huntMonster("astraviajudge", "La", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("theworld", 2144, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70995",
            "Astravia Castle Present I",
            'Mode: [select] only\nShould the bot buy "Astravia Castle Present I" ?',
            false,
        ),
        option.bool(
            "70994",
            "Astravia Castle Past I",
            'Mode: [select] only\nShould the bot buy "Astravia Castle Past I" ?',
            false,
        ),
        option.bool(
            "70996",
            "Astravia Castle Past II",
            'Mode: [select] only\nShould the bot buy "Astravia Castle Past II" ?',
            false,
        ),
        option.bool(
            "70997",
            "Astravia Castle Present II",
            'Mode: [select] only\nShould the bot buy "Astravia Castle Present II" ?',
            false,
        ),
        option.bool(
            "70883",
            "Ring Of Creation (Activated)",
            'Mode: [select] only\nShould the bot buy "Ring Of Creation (Activated)" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TheWorldHouseMerge.select,
});

export default function main(): void {
    const script = new TheWorldHouseMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
