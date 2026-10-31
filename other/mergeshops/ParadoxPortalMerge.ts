/*
name: ParadoxPortalMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/ParadoxPortalMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ParadoxPortalMerge {
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
                case "Paradox Core":

                case "Time Heart":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("portalmazec", "Vorefax ", req.name, quant, { isTemp: false });
                    break;
                case "Paradox Gem":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("dragontown", "The Neverborn", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("portalmaze", 1248, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34829",
            "Jurassic Monarch Wings",
            'Mode: [select] only\nShould the bot buy "Jurassic Monarch Wings" ?',
            false,
        ),
        option.bool(
            "34905",
            "Green Death of Time Scythe",
            'Mode: [select] only\nShould the bot buy "Green Death of Time Scythe" ?',
            false,
        ),
        option.bool(
            "34927",
            "Jurassic Butterfly",
            'Mode: [select] only\nShould the bot buy "Jurassic Butterfly" ?',
            false,
        ),
        option.bool(
            "34924",
            "Valen and Lynaria Armor",
            'Mode: [select] only\nShould the bot buy "Valen and Lynaria Armor" ?',
            false,
        ),
        option.bool("34917", "Blue Portal Cape", 'Mode: [select] only\nShould the bot buy "Blue Portal Cape" ?', false),
        option.bool(
            "34918",
            "Orange Portal Cape",
            'Mode: [select] only\nShould the bot buy "Orange Portal Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ParadoxPortalMerge.select,
});

export default function main(): void {
    const script = new ParadoxPortalMerge();
    Core.bankingBlackList.push("Paradox Core", "Time Heart", "Paradox Gem ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
