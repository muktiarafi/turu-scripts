/*
name: Dark Alliance Merge
description: This bot will farm the items from the Dark Alliance Merge shop in /darkalliance
tags: dark, alliance, merge, legion, shadow, orb, dark, spirit, mana, gem, shadow, flame, underworld, horror, shadowscythe, warlock
*/
// Port of Scripts/Legion/MergeShops/DarkAllianceMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DarkAllianceMerge {
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
                case "Shadow Orb":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("innershadows", "Shadowcrow", req.name, quant, { isTemp: false });
                    break;
                case "Dark Spirit":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("darkalliance", "Shadow Void", req.name, quant, { isTemp: false });
                    break;
                case "Mana Gem":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("darkalliance", "Underflame Guardian", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("darkalliance", 1872, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "54038",
            "ArchFiend of the ShadowFlame",
            'Mode: [select] only\nShould the bot buy "ArchFiend of the ShadowFlame" ?',
            false,
        ),
        option.bool(
            "54039",
            "ShadowFlame Fiend Morph",
            'Mode: [select] only\nShould the bot buy "ShadowFlame Fiend Morph" ?',
            false,
        ),
        option.bool(
            "54040",
            "ShadowFlame OverFiend Blade",
            'Mode: [select] only\nShould the bot buy "ShadowFlame OverFiend Blade" ?',
            false,
        ),
        option.bool(
            "54057",
            "Underworld Horror",
            'Mode: [select] only\nShould the bot buy "Underworld Horror" ?',
            false,
        ),
        option.bool(
            "54058",
            "Underworld Horror Hood",
            'Mode: [select] only\nShould the bot buy "Underworld Horror Hood" ?',
            false,
        ),
        option.bool(
            "54059",
            "Underworld Horror Cape",
            'Mode: [select] only\nShould the bot buy "Underworld Horror Cape" ?',
            false,
        ),
        option.bool(
            "54060",
            "Underworld Horror Wings",
            'Mode: [select] only\nShould the bot buy "Underworld Horror Wings" ?',
            false,
        ),
        option.bool(
            "54061",
            "Underworld Horror Blade",
            'Mode: [select] only\nShould the bot buy "Underworld Horror Blade" ?',
            false,
        ),
        option.bool(
            "54270",
            "ShadowScythe Warlock",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Warlock" ?',
            false,
        ),
        option.bool(
            "54271",
            "Shadow Warlock's Hat",
            'Mode: [select] only\nShould the bot buy "Shadow Warlock\'s Hat" ?',
            false,
        ),
        option.bool(
            "54272",
            "Shadow Warlock's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Shadow Warlock\'s Hat + Locks" ?',
            false,
        ),
        option.bool("54274", "ShadowScythe Hat", 'Mode: [select] only\nShould the bot buy "ShadowScythe Hat" ?', false),
        option.bool(
            "54275",
            "ShadowScythe Hat + Locks",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Hat + Locks" ?',
            false,
        ),
        option.bool("54284", "Rune of Light", 'Mode: [select] only\nShould the bot buy "Rune of Light" ?', false),
        option.bool(
            "54286",
            "Dual Runes of Light",
            'Mode: [select] only\nShould the bot buy "Dual Runes of Light" ?',
            false,
        ),
        option.bool(
            "54276",
            "ShadowScythe Hat + Skull",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Hat + Skull" ?',
            false,
        ),
        option.bool(
            "54277",
            "ShadowScythe Warlock Hair",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Warlock Hair" ?',
            false,
        ),
        option.bool(
            "54278",
            "ShadowScythe Warlock Locks",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Warlock Locks" ?',
            false,
        ),
        option.bool(
            "54279",
            "ShadowScythe Warlock Skull Morph",
            'Mode: [select] only\nShould the bot buy "ShadowScythe Warlock Skull Morph" ?',
            false,
        ),
        option.bool(
            "54282",
            "Lesser Rune of Light",
            'Mode: [select] only\nShould the bot buy "Lesser Rune of Light" ?',
            false,
        ),
        option.bool(
            "54283",
            "Lesser Rune of Darkness",
            'Mode: [select] only\nShould the bot buy "Lesser Rune of Darkness" ?',
            false,
        ),
        option.bool("54285", "Rune of Darkness", 'Mode: [select] only\nShould the bot buy "Rune of Darkness" ?', false),
        option.bool(
            "54287",
            "Dual Runes of Darkness",
            'Mode: [select] only\nShould the bot buy "Dual Runes of Darkness" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkAllianceMerge.select,
});

export default function main(): void {
    const script = new DarkAllianceMerge();
    Core.bankingBlackList.push("Shadow Orb", "Dark Spirit", "Mana Gem");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
