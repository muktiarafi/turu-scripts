/*
name: Noxus War Spoils Merge
description: This bot will farm the items belonging to the selected mode for the Noxus War Spoils Merge [2589] in /lichwar
tags: noxus, war, spoils, merge, lichwar, psychophant, horned, morph, wings, psychophants, spear, noxious, beast
*/
// Port of Scripts/Other/MergeShops/NoxusWarSpoilsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class NoxusWarSpoilsMerge {
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
                case "Noxus' Favor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger("Noxus' Favor requires membership to farm, skipping.");
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.registerQuests(10278, 10279);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonster("lichwar", "Grim Soldier", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lichwar", 2589, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "94087",
            "Noxus Psychophant",
            'Mode: [select] only\nShould the bot buy "Noxus Psychophant" ?',
            false,
        ),
        option.bool(
            "94088",
            "Horned Noxus Psychophant Morph",
            'Mode: [select] only\nShould the bot buy "Horned Noxus Psychophant Morph" ?',
            false,
        ),
        option.bool(
            "94089",
            "Noxus Psychophant Morph",
            'Mode: [select] only\nShould the bot buy "Noxus Psychophant Morph" ?',
            false,
        ),
        option.bool(
            "94090",
            "Noxus Psychophant Hair",
            'Mode: [select] only\nShould the bot buy "Noxus Psychophant Hair" ?',
            false,
        ),
        option.bool(
            "94091",
            "Noxus Psychophant Locks",
            'Mode: [select] only\nShould the bot buy "Noxus Psychophant Locks" ?',
            false,
        ),
        option.bool(
            "94092",
            "Noxus Psychophant Visage",
            'Mode: [select] only\nShould the bot buy "Noxus Psychophant Visage" ?',
            false,
        ),
        option.bool(
            "94093",
            "Noxus Psychophant Wings",
            'Mode: [select] only\nShould the bot buy "Noxus Psychophant Wings" ?',
            false,
        ),
        option.bool(
            "94095",
            "Noxus Psychophant's Spear",
            'Mode: [select] only\nShould the bot buy "Noxus Psychophant\'s Spear" ?',
            false,
        ),
        option.bool(
            "94097",
            "Noxious Beast Gauntlet",
            'Mode: [select] only\nShould the bot buy "Noxious Beast Gauntlet" ?',
            false,
        ),
        option.bool(
            "94096",
            "Noxious Beast Gauntlets",
            'Mode: [select] only\nShould the bot buy "Noxious Beast Gauntlets" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: NoxusWarSpoilsMerge.select,
});

export default function main(): void {
    const script = new NoxusWarSpoilsMerge();
    Core.bankingBlackList.push("Noxus' Favor");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
