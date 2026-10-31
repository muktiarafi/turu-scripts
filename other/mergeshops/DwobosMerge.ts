/*
name: DwobosMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/DwobosMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreNation } from "../../nation/CoreNation";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();

export class DwobosMerge {
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
                case "Dwobo Coin":
                    Nation.dwoboCoin(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("crashruins", 1212, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("33440", "Dwakel Warrior", 'Mode: [select] only\nShould the bot buy "Dwakel Warrior" ?', false),
        option.bool("33441", "Dwakel Morph", 'Mode: [select] only\nShould the bot buy "Dwakel Morph" ?', false),
        option.bool(
            "33327",
            "Magical Butter Stick of Power",
            'Mode: [select] only\nShould the bot buy "Magical Butter Stick of Power" ?',
            false,
        ),
        option.bool("33442", "Orb of Alexander", 'Mode: [select] only\nShould the bot buy "Orb of Alexander" ?', false),
        option.bool("29424", "Nulglin", 'Mode: [select] only\nShould the bot buy "Nulglin" ?', false),
        option.bool(
            "33439",
            "Galactic Treasure Hunter",
            'Mode: [select] only\nShould the bot buy "Galactic Treasure Hunter" ?',
            false,
        ),
        option.bool("33433", "Dwobo Bank", 'Mode: [select] only\nShould the bot buy "Dwobo Bank" ?', false),
        option.bool(
            "33453",
            "Gem of Nulgath Cape",
            'Mode: [select] only\nShould the bot buy "Gem of Nulgath Cape" ?',
            false,
        ),
        option.bool(
            "33451",
            "Gemstone of Nulgath",
            'Mode: [select] only\nShould the bot buy "Gemstone of Nulgath" ?',
            false,
        ),
        option.bool("33461", "Rustbucket Armor", 'Mode: [select] only\nShould the bot buy "Rustbucket Armor" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DwobosMerge.select,
});

export default function main(): void {
    const script = new DwobosMerge();
    Core.bankingBlackList.push("Dwobo Coin ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
