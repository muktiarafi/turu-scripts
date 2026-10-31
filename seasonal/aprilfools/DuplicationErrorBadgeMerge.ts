/*
name: Duplication Error Badge Merge
description: This bot will farm the items belonging to the selected mode for the Duplication Error Badge Merge [2426] in /ebilart
tags: duplication, error, badge, merge, ebilart, ai, oh, no, miko, guest, , ultimate
*/
// Port of Scripts/Seasonal/AprilFools/DuplicationErrorBadgeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { EbilArt } from "./EbilArt";

const Adv = new CoreAdvanced();
const EA = new EbilArt();

export class DuplicationErrorBadgeMerge {
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
                case "Duplication Error":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ebilart", "Ebil AI Blender", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("ebilart")) {
            return;
        }

        EA.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ebilart", 2426, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "85094",
            "AI (Oh No!) Miko Guest 0.0",
            'Mode: [select] only\nShould the bot buy "AI (Oh No!) Miko Guest 0.0" ?',
            false,
        ),
        option.bool(
            "85095",
            "AI (Oh No!) Miko Guest 1.0",
            'Mode: [select] only\nShould the bot buy "AI (Oh No!) Miko Guest 1.0" ?',
            false,
        ),
        option.bool(
            "85096",
            "AI (Oh No!) Miko Guest 2.0",
            'Mode: [select] only\nShould the bot buy "AI (Oh No!) Miko Guest 2.0" ?',
            false,
        ),
        option.bool(
            "85097",
            "AI (Oh No!) Miko Guest 3.0",
            'Mode: [select] only\nShould the bot buy "AI (Oh No!) Miko Guest 3.0" ?',
            false,
        ),
        option.bool(
            "85098",
            "AI (Oh No!) Miko Guest 4.0",
            'Mode: [select] only\nShould the bot buy "AI (Oh No!) Miko Guest 4.0" ?',
            false,
        ),
        option.bool(
            "85099",
            "ULTIMATE AI (Oh No!) Miko Guest",
            'Mode: [select] only\nShould the bot buy "ULTIMATE AI (Oh No!) Miko Guest" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DuplicationErrorBadgeMerge.select,
});

export default function main(): void {
    const script = new DuplicationErrorBadgeMerge();
    Core.bankingBlackList.push("Duplication Error");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
