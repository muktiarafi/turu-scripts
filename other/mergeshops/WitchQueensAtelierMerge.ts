/*
name: Witch Queen's Atelier Merge
description: This script will farm the items required to get all the items from the Witch Queen's Atelier Merge Shop.
tags: witch, queen, atelier, merge, birgittaspire, talia, galilera, starlight, chaser, visionary, astrolabe
*/
// Port of Scripts/Other/MergeShops/WitchQueensAtelierMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class WitchQueensAtelierMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats.
    private dontStopMissingIng = false;

    /** Initializes options and starts the merge-shop farming routine. */

    /** Farms the selected items from Witch Queen's Atelier merge shop. */
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
                case "Witch Princess' Hat":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(10824);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("birgittaspire", "r2", "Left", "Witch Queen Talia", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Crystalized Darkovian Tear":

                case "Witch Princess' Astrolabe":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("birgittaspire", "r2", "Left", "Witch Queen Talia", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Gold Voucher 100k":
                    Farm.voucher(req.name, quant);
                    break;
            }
        };
        Adv.startBuyAllMerge("birgittaspire", 2751, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "102565",
            "Noble Cavendish Witch",
            'Mode: [select] only\nShould the bot buy "Noble Cavendish Witch" ?',
            false,
        ),
        option.bool(
            "102570",
            "Visionary Astrolabe",
            'Mode: [select] only\nShould the bot buy "Visionary Astrolabe" ?',
            false,
        ),
        option.bool("102572", "Dual Galilera", 'Mode: [select] only\nShould the bot buy "Dual Galilera" ?', false),
        option.bool(
            "102566",
            "Starlight Chaser's Morph",
            'Mode: [select] only\nShould the bot buy "Starlight Chaser\'s Morph" ?',
            false,
        ),
        option.bool(
            "102567",
            "Starlight Chaser's Visage",
            'Mode: [select] only\nShould the bot buy "Starlight Chaser\'s Visage" ?',
            false,
        ),
        option.bool(
            "102568",
            "Starlight Chaser's Hat",
            'Mode: [select] only\nShould the bot buy "Starlight Chaser\'s Hat" ?',
            false,
        ),
        option.bool(
            "102569",
            "Starlight Witch Hat",
            'Mode: [select] only\nShould the bot buy "Starlight Witch Hat" ?',
            false,
        ),
        option.bool("102571", "Galilera", 'Mode: [select] only\nShould the bot buy "Galilera" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions("WitchQueensAtelierMerge", [], true, {
    Generic: Adv.mergeOptions,
    Select: WitchQueensAtelierMerge.select,
});

export default function main(): void {
    const script = new WitchQueensAtelierMerge();
    Core.bankingBlackList.push(
        "Gold Voucher 100k",
        "Witch Princess' Hat",
        "Starlight Chaser's Morph",
        "Starlight Chaser's Visage",
        "Crystalized Darkovian Tear",
        "Witch Princess' Astrolabe",
        "Galilera",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
