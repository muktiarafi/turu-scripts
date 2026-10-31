/*
name: Cysero Squared Merge
description: This bot will farm the items belonging to the selected mode for the Cysero Squared Merge [2653] in /cyseroparadox
tags: cysero, squared, merge, cyseroparadox, ducky, earmuffs, morph, mad, chronosmith, chronosmiths, tophat, paradox, enigma, distorqueo, hammer, pieradox
*/
// Port of Scripts/Seasonal/NewYear/CyseroSquaredMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CyseroSquaredMerge {
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
                //#region Items not setup
                case "Temporal Sock Fiber":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.equipClass(ClassType.Solo);
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    Core.registerQuests(Core.checkInventory("Star Captain") ? 10543 : Core.isMember ? 10542 : 10541);
                    Core.killBossWithSecondary("cyseroparadox", "r2", "Bottom", 1, 2, req.name, quant, req.temp, false);
                    bot.wait.forPickup(req.name);
                    break;
                case "Slice of Time Pie-radox":

                case "Pair of Pie-radox Slices":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.killBossWithSecondary("cyseroparadox", "r2", "Bottom", 1, 2, req.name, quant, req.temp, false);
                    bot.wait.forPickup(req.name);
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("cyseroparadox", 2653, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "97874",
            "Ducky Earmuffs Morph",
            'Mode: [select] only\nShould the bot buy "Ducky Earmuffs Morph" ?',
            false,
        ),
        option.bool(
            "97875",
            "Ducky Earmuffs Visage",
            'Mode: [select] only\nShould the bot buy "Ducky Earmuffs Visage" ?',
            false,
        ),
        option.bool("98233", "Mad Chronosmith", 'Mode: [select] only\nShould the bot buy "Mad Chronosmith" ?', false),
        option.bool(
            "98234",
            "Chronosmith's Tophat Morph",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Tophat Morph" ?',
            false,
        ),
        option.bool(
            "98235",
            "Chronosmith's Tophat Visage",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Tophat Visage" ?',
            false,
        ),
        option.bool(
            "98236",
            "Chronosmith's Morph",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Morph" ?',
            false,
        ),
        option.bool(
            "98237",
            "Chronosmith's Visage",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Visage" ?',
            false,
        ),
        option.bool(
            "98238",
            "Chronosmith's Hair",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Hair" ?',
            false,
        ),
        option.bool(
            "98239",
            "Chronosmith's Locks",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Locks" ?',
            false,
        ),
        option.bool(
            "98240",
            "Chronosmith's Paradox",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Paradox" ?',
            false,
        ),
        option.bool(
            "98241",
            "Chronosmith's Enigma",
            'Mode: [select] only\nShould the bot buy "Chronosmith\'s Enigma" ?',
            false,
        ),
        option.bool(
            "98242",
            "Distorqueo Hammer",
            'Mode: [select] only\nShould the bot buy "Distorqueo Hammer" ?',
            false,
        ),
        option.bool("98316", "Pie-radox", 'Mode: [select] only\nShould the bot buy "Pie-radox" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CyseroSquaredMerge.select,
});

export default function main(): void {
    const script = new CyseroSquaredMerge();
    Core.bankingBlackList.push("Temporal Sock Fiber", "Slice of Time Pie-radox", "Pair of Pie-radox Slices");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
