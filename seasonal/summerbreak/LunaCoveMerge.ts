/*
name: Luna Cove Merge
description: This will farm the Luna Cove items.
tags: farm, merge, shop, luna-cove, summer-break
*/
// Port of Scripts/Seasonal/SummerBreak/LunaCoveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LunaCoveMerge {
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
                case "Moon Rock Fragments":
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("lunacove", "r2", "Right", "*", req.name, quant, { isTemp: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("lunacove")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lunacove", 32, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "30397",
            "Beachin' Werewolf",
            'Mode: [select] only\nShould the bot buy "Beachin\' Werewolf" ?',
            false,
        ),
        option.bool("30398", "Were-diver Morph", 'Mode: [select] only\nShould the bot buy "Were-diver Morph" ?', false),
        option.bool("30399", "Snorkling Wolf", 'Mode: [select] only\nShould the bot buy "Snorkling Wolf" ?', false),
        option.bool(
            "30400",
            "Wolf on the Beach Morph",
            'Mode: [select] only\nShould the bot buy "Wolf on the Beach Morph" ?',
            false,
        ),
        option.bool(
            "30391",
            "Spiralling Stars Hair",
            'Mode: [select] only\nShould the bot buy "Spiralling Stars Hair" ?',
            false,
        ),
        option.bool(
            "30392",
            "Spiralling Stars Locks",
            'Mode: [select] only\nShould the bot buy "Spiralling Stars Locks" ?',
            false,
        ),
        option.bool(
            "30402",
            "Crescent Moon Staff",
            'Mode: [select] only\nShould the bot buy "Crescent Moon Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LunaCoveMerge.select,
});

export default function main(): void {
    const script = new LunaCoveMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
