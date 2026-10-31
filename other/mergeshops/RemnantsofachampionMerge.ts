/*
name: Remnants of a Champion Merge
description: This bot will farm the items belonging to the selected mode for the Remnants of a Champion Merge [2711] in /flameusurper
tags: remnants, of, a, champion, merge, flameusurper, flame, maleno, albedo, citrinitas, rubedo, usurper, manifestations, magnum, opus, wings, divine, quintessence, eye, extinction, house, intro, scion, destruction, horns, morph, companion, liberta, aeterna
*/
// Port of Scripts/Other/MergeShops/RemnantsofachampionMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { WarwickForestMerge } from "./WarwickForestMerge";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();
const WFM = new WarwickForestMerge();

export class RemnantsofachampionMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
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
                case "Great Flame of Yew":

                case "Cinders of a Champion":
                    Core.logger(
                        "As of the time of making this, the bot *Cannot* farm this item. farm it yourself manaully then rerun this.",
                    );
                    break;
                case "Blade of Rubedo":
                    WFM.buyAllMerge(req.name);
                    break;
            }
        };
        AOR.rubedoPeak();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("flameusurper", 2711, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("100873", "Flame of Maleno", 'Mode: [select] only\nShould the bot buy "Flame of Maleno" ?', false),
        option.bool("100877", "Flame of Albedo", 'Mode: [select] only\nShould the bot buy "Flame of Albedo" ?', false),
        option.bool(
            "100881",
            "Flame of Citrinitas",
            'Mode: [select] only\nShould the bot buy "Flame of Citrinitas" ?',
            false,
        ),
        option.bool("100887", "Flame of Rubedo", 'Mode: [select] only\nShould the bot buy "Flame of Rubedo" ?', false),
        option.bool(
            "100945",
            "Flame Usurper Manifestations",
            'Mode: [select] only\nShould the bot buy "Flame Usurper Manifestations" ?',
            false,
        ),
        option.bool(
            "100867",
            "Magnum Opus Wings",
            'Mode: [select] only\nShould the bot buy "Magnum Opus Wings" ?',
            false,
        ),
        option.bool(
            "100868",
            "Divine Quintessence Wings",
            'Mode: [select] only\nShould the bot buy "Divine Quintessence Wings" ?',
            false,
        ),
        option.bool(
            "100869",
            "Eye of Extinction",
            'Mode: [select] only\nShould the bot buy "Eye of Extinction" ?',
            false,
        ),
        option.bool(
            "100948",
            "Flame of Maleno House Intro",
            'Mode: [select] only\nShould the bot buy "Flame of Maleno House Intro" ?',
            false,
        ),
        option.bool(
            "100872",
            "Flame Scion Gauntlets",
            'Mode: [select] only\nShould the bot buy "Flame Scion Gauntlets" ?',
            false,
        ),
        option.bool(
            "100863",
            "Scion of Destruction Helm",
            'Mode: [select] only\nShould the bot buy "Scion of Destruction Helm" ?',
            false,
        ),
        option.bool(
            "100864",
            "Scion of Destruction Mask",
            'Mode: [select] only\nShould the bot buy "Scion of Destruction Mask" ?',
            false,
        ),
        option.bool(
            "100865",
            "Scion of Destruction Horns",
            'Mode: [select] only\nShould the bot buy "Scion of Destruction Horns" ?',
            false,
        ),
        option.bool(
            "100866",
            "Scion of Destruction Morph",
            'Mode: [select] only\nShould the bot buy "Scion of Destruction Morph" ?',
            false,
        ),
        option.bool(
            "100947",
            "Flame Usurper Companion Blades",
            'Mode: [select] only\nShould the bot buy "Flame Usurper Companion Blades" ?',
            false,
        ),
        option.bool(
            "100946",
            "Flame Usurper Blades",
            'Mode: [select] only\nShould the bot buy "Flame Usurper Blades" ?',
            false,
        ),
        option.bool("100870", "Liberta Aeterna", 'Mode: [select] only\nShould the bot buy "Liberta Aeterna" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RemnantsofachampionMerge.select,
});

export default function main(): void {
    const script = new RemnantsofachampionMerge();
    Core.bankingBlackList.push("Great Flame of Yew", "Cinders of a Champion", "Blade of Rubedo");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
