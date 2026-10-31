/*
name: UnderworldTeamMerge
description: null
tags: null
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/UnderworldTeamMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class UnderworldTeamMerge {
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
                case "Legion Combat Trophy":
                    Legion.dagePvP(quant, 0, 0);
                    break;
                case "1v1 Legion PvP Trophy":
                    Core.logger("Cannot Get Item, Requires Manual pvp.");
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("legionpvp", 1695, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        //Items the bot Cannot get dueu to 1v1 pvp trophy
        // new Option<bool>("47592", "Legion Spellcaster", "Mode: [select] only\nShould the bot buy \"Legion Spellcaster\" ?", false),
        // new Option<bool>("47596", "Legion SpellCaster's Morph Locks", "Mode: [select] only\nShould the bot buy \"Legion SpellCaster's Morph Locks\" ?", false),
        // new Option<bool>("47594", "Legion SpellCaster's Mask Locks", "Mode: [select] only\nShould the bot buy \"Legion SpellCaster's Mask Locks\" ?", false),
        // new Option<bool>("47598", "Legion SpellCaster's Hair", "Mode: [select] only\nShould the bot buy \"Legion SpellCaster's Hair\" ?", false),
        // new Option<bool>("47595", "Legion SpellCaster's Locks", "Mode: [select] only\nShould the bot buy \"Legion SpellCaster's Locks\" ?", false),
        // new Option<bool>("47597", "Legion SpellCaster's Skull Morph", "Mode: [select] only\nShould the bot buy \"Legion SpellCaster's Skull Morph\" ?", false),
        // new Option<bool>("47593", "Legion SpellCaster's Spikes", "Mode: [select] only\nShould the bot buy \"Legion SpellCaster's Spikes\" ?", false),
        // new Option<bool>("47599", "Immortal Skull Morph", "Mode: [select] only\nShould the bot buy \"Immortal Skull Morph\" ?", false),
        // new Option<bool>("47600", "Dark Flame Morph", "Mode: [select] only\nShould the bot buy \"Dark Flame Morph\" ?", false),
        //Itmes the bot can get without 1v1 trophie
        option.bool(
            "47339",
            "Scarred Caster's Hair",
            'Mode: [select] only\nShould the bot buy "Scarred Caster\'s Hair" ?',
            false,
        ),
        option.bool(
            "47605",
            "Wings of the Underworld",
            'Mode: [select] only\nShould the bot buy "Wings of the Underworld" ?',
            false,
        ),
        option.bool(
            "47606",
            "Dark Runes of the Underworld",
            'Mode: [select] only\nShould the bot buy "Dark Runes of the Underworld" ?',
            false,
        ),
        option.bool(
            "47334",
            "Scarred Caster's Locks",
            'Mode: [select] only\nShould the bot buy "Scarred Caster\'s Locks" ?',
            false,
        ),
        option.bool(
            "47611",
            "Burning Skull Mace",
            'Mode: [select] only\nShould the bot buy "Burning Skull Mace" ?',
            false,
        ),
        option.bool(
            "47602",
            "Legion's Fiend Helm",
            'Mode: [select] only\nShould the bot buy "Legion\'s Fiend Helm" ?',
            false,
        ),
        option.bool(
            "47607",
            "SpellCaster's Dark Staff",
            'Mode: [select] only\nShould the bot buy "SpellCaster\'s Dark Staff" ?',
            false,
        ),
        option.bool(
            "47609",
            "SpellCaster's Dark Accoutrements",
            'Mode: [select] only\nShould the bot buy "SpellCaster\'s Dark Accoutrements" ?',
            false,
        ),
        option.bool(
            "47344",
            "Wrath of the Legion Blade",
            'Mode: [select] only\nShould the bot buy "Wrath of the Legion Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: UnderworldTeamMerge.select,
});

export default function main(): void {
    const script = new UnderworldTeamMerge();
    Core.bankingBlackList.push("Legion Combat Trophy", "1v1 Legion PvP Trophy");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
