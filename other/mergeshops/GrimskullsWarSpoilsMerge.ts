/*
name: Grimskulls War Spoils Merge
description: This bot will farm the items belonging to the selected mode for the Grimskulls War Spoils Merge [2590] in /lichwar
tags: grimskulls, war, spoils, merge, lichwar, grimskull, psychophant, halo, morph, wings, grim, psychophants, scythe, fists, fist
*/
// Port of Scripts/Other/MergeShops/GrimskullsWarSpoilsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class GrimskullsWarSpoilsMerge {
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
                case "Grimskull's Favor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger("Grimskull's Favor requires membership to farm, skipping.");
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10282, 10283);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("lichwar", "Noxus Warrior", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lichwar", 2590, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94075",
            "Grimskull Psychophant",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant" ?',
            false,
        ),
        option.bool(
            "94076",
            "Grimskull Psychophant Halo Morph",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant Halo Morph" ?',
            false,
        ),
        option.bool(
            "94077",
            "Grimskull Psychophant Morph",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant Morph" ?',
            false,
        ),
        option.bool(
            "94078",
            "Grimskull Psychophant Hair",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant Hair" ?',
            false,
        ),
        option.bool(
            "94079",
            "Grimskull Psychophant Halo Visage",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant Halo Visage" ?',
            false,
        ),
        option.bool(
            "94080",
            "Grimskull Psychophant Visage",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant Visage" ?',
            false,
        ),
        option.bool(
            "94081",
            "Grimskull Psychophant Locks",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant Locks" ?',
            false,
        ),
        option.bool(
            "94082",
            "Grimskull Psychophant Wings",
            'Mode: [select] only\nShould the bot buy "Grimskull Psychophant Wings" ?',
            false,
        ),
        option.bool(
            "94084",
            "Grim Psychophant's Scythe",
            'Mode: [select] only\nShould the bot buy "Grim Psychophant\'s Scythe" ?',
            false,
        ),
        option.bool(
            "94085",
            "Grim Psychophant's Fists",
            'Mode: [select] only\nShould the bot buy "Grim Psychophant\'s Fists" ?',
            false,
        ),
        option.bool(
            "94086",
            "Grim Psychophant's Fist",
            'Mode: [select] only\nShould the bot buy "Grim Psychophant\'s Fist" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GrimskullsWarSpoilsMerge.select,
});

export default function main(): void {
    const script = new GrimskullsWarSpoilsMerge();
    Core.bankingBlackList.push("Grimskull's Favor");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
