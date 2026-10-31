/*
name: Thirdspell Merge
description: This bot will farm the items belonging to the selected mode for the Thirdspell Merge [892] in /thirdspell
tags: thirdspell, merge, thirdspell, fiery, flaring, flame, floating, sun, flare, loyal, solar, entity, morph, ephemerite, mace, stingers, lance
*/
// Port of Scripts/Other/MergeShops/ThirdspellMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ThirdspellMerge {
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
                case "Thirdspell Token":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("thirdspell", "Pure Fire Elemental", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("thirdspell", 892, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "30829",
            "Fiery Flaring Flame",
            'Mode: [select] only\nShould the bot buy "Fiery Flaring Flame" ?',
            false,
        ),
        option.bool(
            "30830",
            "Floating Sun Flare",
            'Mode: [select] only\nShould the bot buy "Floating Sun Flare" ?',
            false,
        ),
        option.bool("30831", "Loyal Sun Flare", 'Mode: [select] only\nShould the bot buy "Loyal Sun Flare" ?', false),
        option.bool("30832", "Solar Entity", 'Mode: [select] only\nShould the bot buy "Solar Entity" ?', false),
        option.bool("30833", "Solar Morph", 'Mode: [select] only\nShould the bot buy "Solar Morph" ?', false),
        option.bool("30834", "Dual Fiery Flame", 'Mode: [select] only\nShould the bot buy "Dual Fiery Flame" ?', false),
        option.bool(
            "30882",
            "Fiery Ephemerite Mace",
            'Mode: [select] only\nShould the bot buy "Fiery Ephemerite Mace" ?',
            false,
        ),
        option.bool("30890", "Solar Stingers", 'Mode: [select] only\nShould the bot buy "Solar Stingers" ?', false),
        option.bool("30904", "Armor of the Sun", 'Mode: [select] only\nShould the bot buy "Armor of the Sun" ?', false),
        option.bool("30905", "Cape of the Sun", 'Mode: [select] only\nShould the bot buy "Cape of the Sun" ?', false),
        option.bool(
            "30906",
            "Helmet of the Sun",
            'Mode: [select] only\nShould the bot buy "Helmet of the Sun" ?',
            false,
        ),
        option.bool("30907", "Lance of the Sun", 'Mode: [select] only\nShould the bot buy "Lance of the Sun" ?', false),
        option.bool("30912", "Solar Entity", 'Mode: [select] only\nShould the bot buy "Solar Entity" ?', false),
        option.bool("30913", "Solar Morph", 'Mode: [select] only\nShould the bot buy "Solar Morph" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ThirdspellMerge.select,
});

export default function main(): void {
    const script = new ThirdspellMerge();
    Core.bankingBlackList.push("Thirdspell Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
