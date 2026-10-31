/*
name: Fortress Delve Merge
description: This bot will farm the required items from /fortressdelve, do the story, and buy items from the merge shop
tags: fortressdelve, merge, dage, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/FortressDelveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { FortressDelve } from "./FortressDelve";

const Adv = new CoreAdvanced();
const FD = new FortressDelve();

export class FortressDelveMerge {
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
                case "Rune of Radiance":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9170);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("fortressdelve", "Enlightened Shadow", "Shadowscythe Bone Shard", 10, {
                            log: false,
                        });
                        Core.huntMonster("fortressdelve", "Delirious Elemental", "Elemental Residue", 10, {
                            log: false,
                        });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("fortressdelve", "Astero", "Glass Wing", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        FD.doStory();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fortressdelve", 2247, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "76755",
            "Undead Parabellum Gauntlets",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Gauntlets" ?',
            false,
        ),
        option.bool(
            "76754",
            "Undead Parabellum Gauntlet",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Gauntlet" ?',
            false,
        ),
        option.bool(
            "76753",
            "Undead Parabellum Sword and Shield",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Sword and Shield" ?',
            false,
        ),
        option.bool(
            "76752",
            "Undead Parabellum Hammer",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Hammer" ?',
            false,
        ),
        option.bool(
            "76751",
            "Undead Parabellum Blades",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Blades" ?',
            false,
        ),
        option.bool(
            "76750",
            "Undead Parabellum Blade",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Blade" ?',
            false,
        ),
        option.bool(
            "76749",
            "Undead Parabellum Back Sword and Shield",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Back Sword and Shield" ?',
            false,
        ),
        option.bool(
            "76748",
            "Undead Parabellum Back Sword",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Back Sword" ?',
            false,
        ),
        option.bool(
            "76747",
            "Undead Parabellum Back Shield",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Back Shield" ?',
            false,
        ),
        option.bool(
            "76746",
            "Undead Parabellum Back Hammer",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Back Hammer" ?',
            false,
        ),
        option.bool(
            "76745",
            "Undead Parabellum Guard",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Guard" ?',
            false,
        ),
        option.bool(
            "76744",
            "Undead Parabellum Helm",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Helm" ?',
            false,
        ),
        option.bool(
            "76743",
            "Undead Parabellum Armet",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum Armet" ?',
            false,
        ),
        option.bool(
            "76742",
            "Undead Parabellum",
            'Mode: [select] only\nShould the bot buy "Undead Parabellum" ?',
            false,
        ),
        option.bool(
            "76382",
            "Underworld Infiltrator Cowl",
            'Mode: [select] only\nShould the bot buy "Underworld Infiltrator Cowl" ?',
            false,
        ),
        option.bool(
            "76381",
            "Underworld Infiltrator Hood",
            'Mode: [select] only\nShould the bot buy "Underworld Infiltrator Hood" ?',
            false,
        ),
        option.bool(
            "76380",
            "Underworld Infiltrator",
            'Mode: [select] only\nShould the bot buy "Underworld Infiltrator" ?',
            false,
        ),
        option.bool(
            "76384",
            "Underworld Infiltrator Blade",
            'Mode: [select] only\nShould the bot buy "Underworld Infiltrator Blade" ?',
            false,
        ),
        option.bool(
            "76385",
            "Underworld Infiltrator Blades",
            'Mode: [select] only\nShould the bot buy "Underworld Infiltrator Blades" ?',
            false,
        ),
        option.bool(
            "77020",
            "Young Empress' Armor",
            'Mode: [select] only\nShould the bot buy "Young Empress\' Armor" ?',
            false,
        ),
        option.bool(
            "76789",
            "Young Empress' Blade",
            'Mode: [select] only\nShould the bot buy "Young Empress\' Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FortressDelveMerge.select,
});

export default function main(): void {
    const script = new FortressDelveMerge();
    Core.bankingBlackList.push("Rune of Radiance");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
