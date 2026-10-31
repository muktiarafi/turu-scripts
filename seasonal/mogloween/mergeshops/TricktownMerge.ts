/*
name: Tricktown Merge
description: This will buy all the Tricktown merge items and merge them.
tags: merge, mogloween, seasonal, trick, town
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/TricktownMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreMogloween } from "../CoreMogloween";

const Adv = new CoreAdvanced();
const coreMogloween = new CoreMogloween();

export class TricktownMerge {
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
                case "Treats":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.addDrop("Treats");
                        Core.join("tricktown");
                        Core.killMonster("trickortreat", "Enter", "Spawn", "Trick or Treater");
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Ghastly Gummy":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(8936);
                    // Ghoul Gang 8936
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("tricktown", "Madam Ester", "Crystalized Slime", 1);
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("tricktown", "Decay Spirit", "Decay Essence", 10);
                        Core.huntMonster("tricktown", "Rotting Mound", "Melty Scabs", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("tricktown")) {
            return;
        }
        coreMogloween.trickTown();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("tricktown", 2179, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "72073",
            "Eventide Sorcerer",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer" ?',
            false,
        ),
        option.bool(
            "72074",
            "Eventide Sorcerer's Cut",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Cut" ?',
            false,
        ),
        option.bool(
            "72075",
            "Eventide Sorcerer's Layered Bobcut",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Layered Bobcut" ?',
            false,
        ),
        option.bool(
            "72076",
            "Eventide Sorcerer's Awakened Cut",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Awakened Cut" ?',
            false,
        ),
        option.bool(
            "72077",
            "Eventide Sorcerer Awakened Bobcut",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer Awakened Bobcut" ?',
            false,
        ),
        option.bool(
            "72078",
            "Eventide Sorcerer's Hat",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Hat" ?',
            false,
        ),
        option.bool(
            "72079",
            "Eventide Sorcerer's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "72080",
            "Eventide Sorcerer's Wings",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Wings" ?',
            false,
        ),
        option.bool(
            "72081",
            "Eventide Sorcerer's Rune",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Rune" ?',
            false,
        ),
        option.bool(
            "72082",
            "Eventide Sorcerer's Grimoire",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Grimoire" ?',
            false,
        ),
        option.bool(
            "72083",
            "Eventide Sorcerer's Broom",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Broom" ?',
            false,
        ),
        option.bool(
            "72084",
            "Eventide Sorcerer's Runed Broom",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Runed Broom" ?',
            false,
        ),
        option.bool(
            "72085",
            "Eventide Sorcerer's Offense Rune",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Offense Rune" ?',
            false,
        ),
        option.bool(
            "72086",
            "Eventide Sorcerer's Offense Runes",
            'Mode: [select] only\nShould the bot buy "Eventide Sorcerer\'s Offense Runes" ?',
            false,
        ),
        option.bool(
            "71842",
            "DoomFire Club Shirt",
            'Mode: [select] only\nShould the bot buy "DoomFire Club Shirt" ?',
            false,
        ),
        option.bool("71843", "Twilleven", 'Mode: [select] only\nShould the bot buy "Twilleven" ?', false),
        option.bool("71844", "Rebel Twilleven", 'Mode: [select] only\nShould the bot buy "Rebel Twilleven" ?', false),
        option.bool(
            "71630",
            "Diabolical Noble Garb",
            'Mode: [select] only\nShould the bot buy "Diabolical Noble Garb" ?',
            false,
        ),
        option.bool(
            "71631",
            "Diabolical Noble Morph",
            'Mode: [select] only\nShould the bot buy "Diabolical Noble Morph" ?',
            false,
        ),
        option.bool(
            "71632",
            "Diabolical Noble Spikes",
            'Mode: [select] only\nShould the bot buy "Diabolical Noble Spikes" ?',
            false,
        ),
        option.bool(
            "71633",
            "Diabolical Noble Morph + Bangs",
            'Mode: [select] only\nShould the bot buy "Diabolical Noble Morph + Bangs" ?',
            false,
        ),
        option.bool(
            "71634",
            "Diabolical Noble Bangs",
            'Mode: [select] only\nShould the bot buy "Diabolical Noble Bangs" ?',
            false,
        ),
        option.bool(
            "71635",
            "Devoured Diabolical Sigil",
            'Mode: [select] only\nShould the bot buy "Devoured Diabolical Sigil" ?',
            false,
        ),
        option.bool(
            "71636",
            "Diabolical Ornate Shrine",
            'Mode: [select] only\nShould the bot buy "Diabolical Ornate Shrine" ?',
            false,
        ),
        option.bool(
            "71637",
            "Devoured Sinner's Blade",
            'Mode: [select] only\nShould the bot buy "Devoured Sinner\'s Blade" ?',
            false,
        ),
        option.bool(
            "71638",
            "Devoured Sinner's Blades",
            'Mode: [select] only\nShould the bot buy "Devoured Sinner\'s Blades" ?',
            false,
        ),
        option.bool(
            "71639",
            "Diabolical Sinner's Blade",
            'Mode: [select] only\nShould the bot buy "Diabolical Sinner\'s Blade" ?',
            false,
        ),
        option.bool(
            "71640",
            "Diabolical Sinner's Blades",
            'Mode: [select] only\nShould the bot buy "Diabolical Sinner\'s Blades" ?',
            false,
        ),
        option.bool(
            "71641",
            "Diabolical ManSplitter",
            'Mode: [select] only\nShould the bot buy "Diabolical ManSplitter" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TricktownMerge.select,
});

export default function main(): void {
    const script = new TricktownMerge();
    Core.bankingBlackList.push("Treats", "Ghastly Gummy ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
