/*
name: Rand's Merge
description: This bot will farm Rand's Approval in /seraph and buy items from the merge shop
tags: legion, merge, staff, birthday, rands, approval, dage, evil, seasonal, event, darkbirthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/RandsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class RandsMerge {
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
                case "Rand's Approval":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9129);
                    Core.huntMonster("seraph", "Seraphic Recruit", req.name, quant, { isTemp: false, log: false });
                    Core.cancelRegisteredQuests();
                    break;
                case "Electric Underworld Katana":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("abysslair", "Abyssal Underbeast", req.name, quant, { isTemp: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("darkbirthday")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("darkbirthday", 2243, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "76594",
            "Ripper Blades of the Legion Cape",
            'Mode: [select] only\nShould the bot buy "Ripper Blades of the Legion Cape" ?',
            false,
        ),
        option.bool(
            "76604",
            "Ripper Blade of the Underworld",
            'Mode: [select] only\nShould the bot buy "Ripper Blade of the Underworld" ?',
            false,
        ),
        option.bool(
            "76605",
            "Ripper Blades of the Underworld",
            'Mode: [select] only\nShould the bot buy "Ripper Blades of the Underworld" ?',
            false,
        ),
        option.bool(
            "76608",
            "Sheathed Soul Devouring Katana",
            'Mode: [select] only\nShould the bot buy "Sheathed Soul Devouring Katana" ?',
            false,
        ),
        option.bool(
            "76682",
            "Electric Underworld Katanas",
            'Mode: [select] only\nShould the bot buy "Electric Underworld Katanas" ?',
            false,
        ),
        option.bool(
            "76684",
            "Urban Underworld Rages",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Rages" ?',
            false,
        ),
        option.bool(
            "76670",
            "Urban Underworld Outfit",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Outfit" ?',
            false,
        ),
        option.bool(
            "76677",
            "Urban Underworld Hair + Mask",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Hair + Mask" ?',
            false,
        ),
        option.bool(
            "76671",
            "Urban Underworld Morph",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Morph" ?',
            false,
        ),
        option.bool(
            "76673",
            "Urban Underworld Morph + Mask",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Morph + Mask" ?',
            false,
        ),
        option.bool(
            "76678",
            "Urban Underworld Locks + Mask",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Locks + Mask" ?',
            false,
        ),
        option.bool(
            "76672",
            "Urban Underworld Visage",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Visage" ?',
            false,
        ),
        option.bool(
            "76674",
            "Urban Underworld Visage + Mask",
            'Mode: [select] only\nShould the bot buy "Urban Underworld Visage + Mask" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RandsMerge.select,
});

export default function main(): void {
    const script = new RandsMerge();
    Core.bankingBlackList.push("Rand's Approval", "Electric Underworld Katana");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
