/*
name: BeleensChaosFuzzyMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/BeleensChaosFuzzyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreSummer } from "../../story/summer2015adventuremap/CoreSummer";

const Adv = new CoreAdvanced();
const Summer = new CoreSummer();

export class BeleensChaosFuzzyMerge {
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
                case "Chaos Fuzzies":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.getMapItem(3481, 1, "citadel");
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        Summer.beleen();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("pastelia", 135, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("30121", "Chaos Fuzzy", 'Mode: [select] only\nShould the bot buy "Chaos Fuzzy" ?', false),
        option.bool(
            "30185",
            "Chibi Nulgath Armor",
            'Mode: [select] only\nShould the bot buy "Chibi Nulgath Armor" ?',
            false,
        ),
        option.bool(
            "30089",
            "Spikes of Pink Love",
            'Mode: [select] only\nShould the bot buy "Spikes of Pink Love" ?',
            false,
        ),
        option.bool(
            "30088",
            "Locks of Pink Love",
            'Mode: [select] only\nShould the bot buy "Locks of Pink Love" ?',
            false,
        ),
        option.bool(
            "30169",
            "Chaos Beleen Polearm",
            'Mode: [select] only\nShould the bot buy "Chaos Beleen Polearm" ?',
            false,
        ),
        option.bool("30189", "Reavers of Chaos", 'Mode: [select] only\nShould the bot buy "Reavers of Chaos" ?', false),
        option.bool(
            "30171",
            "Chaos Beleen Blade",
            'Mode: [select] only\nShould the bot buy "Chaos Beleen Blade" ?',
            false,
        ),
        option.bool("30172", "Chaos Beleen Axe", 'Mode: [select] only\nShould the bot buy "Chaos Beleen Axe" ?', false),
        option.bool(
            "30173",
            "Chaos Beleen Scythe",
            'Mode: [select] only\nShould the bot buy "Chaos Beleen Scythe" ?',
            false,
        ),
        option.bool(
            "30187",
            "Chaos Beleen Cloud",
            'Mode: [select] only\nShould the bot buy "Chaos Beleen Cloud" ?',
            false,
        ),
        option.bool(
            "30175",
            "Chibi Nulgath Pet",
            'Mode: [select] only\nShould the bot buy "Chibi Nulgath Pet" ?',
            false,
        ),
        option.bool(
            "30177",
            "Lotsa Love Makai Battlepet",
            'Mode: [select] only\nShould the bot buy "Lotsa Love Makai Battlepet" ?',
            false,
        ),
        option.bool(
            "30170",
            "Cutie Makai On Your Back",
            'Mode: [select] only\nShould the bot buy "Cutie Makai On Your Back" ?',
            false,
        ),
        option.bool(
            "30192",
            "Chibi Nulgath Bank Pet",
            'Mode: [select] only\nShould the bot buy "Chibi Nulgath Bank Pet" ?',
            false,
        ),
        option.bool(
            "30186",
            "Chibi Nulgath Morph",
            'Mode: [select] only\nShould the bot buy "Chibi Nulgath Morph" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BeleensChaosFuzzyMerge.select,
});

export default function main(): void {
    const script = new BeleensChaosFuzzyMerge();
    Core.bankingBlackList.push("Chaos Fuzzies ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
