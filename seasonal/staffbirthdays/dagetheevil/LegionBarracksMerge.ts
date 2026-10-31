/*
name: Legion Barracks Merge
description: This bot will farm the items belonging to the selected mode for the Legion Barracks Merge [2420] in /legionbarracks
tags: legion, barracks, merge, legionbarracks, skeletal, sacrificer, scowling, black, sun, penacho, skull, immortal, tepoztopilli, underworld, sentinel, ponytail, shroud, decima, render, renders, ptolomea, necromancer, blindfold, morph, possessed, kokytos, grand, antaeus, spear
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/LegionBarracksMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Adv = new CoreAdvanced();
const CDB = new CoreDageBirthday();
const Legion = new CoreLegion();

export class LegionBarracksMerge {
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
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
                case "Underworld Drachma":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9620);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.killMonster("legionbarracks", "r4", "Left", "*", "Legion Cocytus Engraving", 6, {
                            log: false,
                        });
                        Core.huntMonster("legionbarracks", "Overdriven paladin", "Paladin's Death Tag", 6, {
                            log: false,
                        });
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("legionbarracks", "Paladin Arondight", "Arondight's Starlight", undefined, {
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Grand Antaeus Spear":
                    Core.logger(`Item ${req.name} is not obtainable anymore.`);
                    break;
            }
        };
        CDB.legionBarracks();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("legionbarracks", 2420, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "84429",
            "Skeletal Sacrificer",
            'Mode: [select] only\nShould the bot buy "Skeletal Sacrificer" ?',
            false,
        ),
        option.bool(
            "84432",
            "Scowling Black Sun Penacho Skull",
            'Mode: [select] only\nShould the bot buy "Scowling Black Sun Penacho Skull" ?',
            false,
        ),
        option.bool(
            "84449",
            "Immortal Sacrificer Tepoztopilli",
            'Mode: [select] only\nShould the bot buy "Immortal Sacrificer Tepoztopilli" ?',
            false,
        ),
        option.bool(
            "84311",
            "Underworld Sentinel",
            'Mode: [select] only\nShould the bot buy "Underworld Sentinel" ?',
            false,
        ),
        option.bool(
            "84312",
            "Underworld Sentinel Helm",
            'Mode: [select] only\nShould the bot buy "Underworld Sentinel Helm" ?',
            false,
        ),
        option.bool(
            "84313",
            "Underworld Sentinel Hair",
            'Mode: [select] only\nShould the bot buy "Underworld Sentinel Hair" ?',
            false,
        ),
        option.bool(
            "84314",
            "Underworld Sentinel Ponytail",
            'Mode: [select] only\nShould the bot buy "Underworld Sentinel Ponytail" ?',
            false,
        ),
        option.bool(
            "84318",
            "Underworld Sentinel Shroud and Blade",
            'Mode: [select] only\nShould the bot buy "Underworld Sentinel Shroud and Blade" ?',
            false,
        ),
        option.bool("84320", "Decima Render", 'Mode: [select] only\nShould the bot buy "Decima Render" ?', false),
        option.bool("84321", "Decima Renders", 'Mode: [select] only\nShould the bot buy "Decima Renders" ?', false),
        option.bool(
            "84422",
            "Ptolomea Necromancer",
            'Mode: [select] only\nShould the bot buy "Ptolomea Necromancer" ?',
            false,
        ),
        option.bool(
            "84423",
            "Ptolomea Necromancer Blindfold Morph",
            'Mode: [select] only\nShould the bot buy "Ptolomea Necromancer Blindfold Morph" ?',
            false,
        ),
        option.bool(
            "84424",
            "Ptolomea Necromancer Blindfold Visage",
            'Mode: [select] only\nShould the bot buy "Ptolomea Necromancer Blindfold Visage" ?',
            false,
        ),
        option.bool(
            "84425",
            "Ptolomea Necromancer Morph",
            'Mode: [select] only\nShould the bot buy "Ptolomea Necromancer Morph" ?',
            false,
        ),
        option.bool(
            "84426",
            "Ptolomea Necromancer Visage",
            'Mode: [select] only\nShould the bot buy "Ptolomea Necromancer Visage" ?',
            false,
        ),
        option.bool(
            "84427",
            "Possessed Kokytos Staff",
            'Mode: [select] only\nShould the bot buy "Possessed Kokytos Staff" ?',
            false,
        ),
        option.bool(
            "84603",
            "Grand Antaeus Spear",
            'Mode: [select] only\nShould the bot buy "Grand Antaeus Spear" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LegionBarracksMerge.select,
});

export default function main(): void {
    const script = new LegionBarracksMerge();
    Core.bankingBlackList.push("Legion Token", "Underworld Drachma", "Grand Antaeus Spear");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
