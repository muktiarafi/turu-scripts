/*
name: Seaview Souvenirs Merge
description: This bot will farm the items belonging to the selected mode for the Seaview Souvenirs Merge [2273] in /ashray
tags: seaview, souvenirs, merge, ashray, villager, goldtrimmed, tricorn, lass, gemme, numari, bandana, stingray, leather, sheathed, inn, mug, mugs, pyromancer, merchant, mariner, mariners, blazing, parrot, pal, hook
*/
// Port of Scripts/Other/MergeShops/SeaviewSouvenirsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class SeaviewSouvenirsMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    protectRequiredItems(): void {
        const items = ["Treasure Chest", "Sur-gion Token"];

        for (const item of items) {
            if (!Core.bankingBlackList.includes(item)) {
                Core.bankingBlackList.push(item);
            }
        }
    }

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
                case "Treasure Chest":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("finalbattle", "r2", "Left", "*", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Sur-gion Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9235);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("ashray", "Enter", "Spawn", "Kitefin Shark Bait", "Shark Fin", 7, {
                            log: false,
                        });
                        Core.killMonster("ashray", "r2", "Left", "Ashray Fisherman", "Ashray Blood Sample", 7, {
                            log: false,
                        });
                        Core.huntMonster("ashray", "Seafoam Elemental", "Seafoam Bubbles", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        this.protectRequiredItems();
        AOR.ashrayVillage();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ashray", 2273, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("72843", "Ashray Villager", 'Mode: [select] only\nShould the bot buy "Ashray Villager" ?', false),
        option.bool(
            "72844",
            "Gold-trimmed Tricorn",
            'Mode: [select] only\nShould the bot buy "Gold-trimmed Tricorn" ?',
            false,
        ),
        option.bool(
            "72845",
            "Ashray Lass' Locks",
            'Mode: [select] only\nShould the bot buy "Ashray Lass\' Locks" ?',
            false,
        ),
        option.bool(
            "72846",
            "Gemme Numari Bandana",
            'Mode: [select] only\nShould the bot buy "Gemme Numari Bandana" ?',
            false,
        ),
        option.bool(
            "72847",
            "Gemme Numari Bandana and Locks",
            'Mode: [select] only\nShould the bot buy "Gemme Numari Bandana and Locks" ?',
            false,
        ),
        option.bool(
            "72848",
            "Stingray Leather Sheathed Blade",
            'Mode: [select] only\nShould the bot buy "Stingray Leather Sheathed Blade" ?',
            false,
        ),
        option.bool("72849", "Seaview Inn Mug", 'Mode: [select] only\nShould the bot buy "Seaview Inn Mug" ?', false),
        option.bool("72850", "Seaview Inn Mugs", 'Mode: [select] only\nShould the bot buy "Seaview Inn Mugs" ?', false),
        option.bool(
            "72851",
            "Ashray Pyromancer",
            'Mode: [select] only\nShould the bot buy "Ashray Pyromancer" ?',
            false,
        ),
        option.bool("72852", "Merchant Mariner", 'Mode: [select] only\nShould the bot buy "Merchant Mariner" ?', false),
        option.bool(
            "72853",
            "Ashray Mariner's Hair",
            'Mode: [select] only\nShould the bot buy "Ashray Mariner\'s Hair" ?',
            false,
        ),
        option.bool(
            "72854",
            "Ashray Mariner's Locks",
            'Mode: [select] only\nShould the bot buy "Ashray Mariner\'s Locks" ?',
            false,
        ),
        option.bool(
            "72855",
            "Mariner's Blazing Parrot Pal",
            'Mode: [select] only\nShould the bot buy "Mariner\'s Blazing Parrot Pal" ?',
            false,
        ),
        option.bool(
            "72856",
            "Ashray Mariner's Hook",
            'Mode: [select] only\nShould the bot buy "Ashray Mariner\'s Hook" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SeaviewSouvenirsMerge.select,
});

export default function main(): void {
    const script = new SeaviewSouvenirsMerge();
    script.protectRequiredItems();
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
