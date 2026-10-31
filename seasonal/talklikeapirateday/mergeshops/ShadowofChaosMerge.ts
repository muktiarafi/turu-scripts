/*
name: Shadow of Chaos Merge
description: This bot will farm the items belonging to the selected mode for the Shadow of Chaos Merge [1917] in /laguna
tags: tlapd, talk-like-a-pirate-day, seasonal, shadow, of, chaos, merge, laguna, chaotic, sorcerer, sorcerers, sorceress, , horns, floating, crystals, energy, claws, gem, khopesh, deepsea, scourge, hunter, tentacled, tentaclewrapped, pistol, pistols
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/ShadowofChaosMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreSoC } from "../../../story/shadowsofchaos/CoreSoC";

const Adv = new CoreAdvanced();
const Laguna = new CoreSoC();

export class ShadowofChaosMerge {
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
                case "ShadowChaos Mote":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7700);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("lagunabeach", "Flying Fisheye");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Laguna.lagunaBeach();
        Adv.startBuyAllMerge("laguna", 1917, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("56158", "Chaotic Sorcerer", 'Mode: [select] only\nShould the bot buy "Chaotic Sorcerer" ?', false),
        option.bool(
            "56159",
            "Chaotic Sorcerer's Hood",
            'Mode: [select] only\nShould the bot buy "Chaotic Sorcerer\'s Hood" ?',
            false,
        ),
        option.bool(
            "56160",
            "Chaotic Sorceress' Visage",
            'Mode: [select] only\nShould the bot buy "Chaotic Sorceress\' Visage" ?',
            false,
        ),
        option.bool(
            "56161",
            "Sorceress' Visage + Horns",
            'Mode: [select] only\nShould the bot buy "Sorceress\' Visage + Horns" ?',
            false,
        ),
        option.bool(
            "56162",
            "Chaotic Sorcerer's Visage",
            'Mode: [select] only\nShould the bot buy "Chaotic Sorcerer\'s Visage" ?',
            false,
        ),
        option.bool(
            "56163",
            "Sorcerer's Visage + Horns",
            'Mode: [select] only\nShould the bot buy "Sorcerer\'s Visage + Horns" ?',
            false,
        ),
        option.bool(
            "56164",
            "Chaotic Floating Crystals",
            'Mode: [select] only\nShould the bot buy "Chaotic Floating Crystals" ?',
            false,
        ),
        option.bool(
            "56165",
            "Chaotic Energy Claws",
            'Mode: [select] only\nShould the bot buy "Chaotic Energy Claws" ?',
            false,
        ),
        option.bool(
            "56166",
            "Chaotic Gem Staff",
            'Mode: [select] only\nShould the bot buy "Chaotic Gem Staff" ?',
            false,
        ),
        option.bool("56167", "Chaotic Khopesh", 'Mode: [select] only\nShould the bot buy "Chaotic Khopesh" ?', false),
        option.bool("56228", "DeepSea Scourge", 'Mode: [select] only\nShould the bot buy "DeepSea Scourge" ?', false),
        option.bool("56229", "DeepSea Hunter", 'Mode: [select] only\nShould the bot buy "DeepSea Hunter" ?', false),
        option.bool(
            "56230",
            "Tentacled Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Tentacled Hat + Locks" ?',
            false,
        ),
        option.bool("56231", "Tentacled Hat", 'Mode: [select] only\nShould the bot buy "Tentacled Hat" ?', false),
        option.bool(
            "56232",
            "DeepSea Hat + Locks",
            'Mode: [select] only\nShould the bot buy "DeepSea Hat + Locks" ?',
            false,
        ),
        option.bool("56233", "DeepSea Hat", 'Mode: [select] only\nShould the bot buy "DeepSea Hat" ?', false),
        option.bool(
            "56234",
            "Tentacle-Wrapped Pistol",
            'Mode: [select] only\nShould the bot buy "Tentacle-Wrapped Pistol" ?',
            false,
        ),
        option.bool("56235", "DeepSea Pistol", 'Mode: [select] only\nShould the bot buy "DeepSea Pistol" ?', false),
        option.bool(
            "56236",
            "Dual DeepSea Pistols",
            'Mode: [select] only\nShould the bot buy "Dual DeepSea Pistols" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowofChaosMerge.select,
});

export default function main(): void {
    const script = new ShadowofChaosMerge();
    Core.bankingBlackList.push("ShadowChaos Mote");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
