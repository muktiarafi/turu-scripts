/*
name: Abyssal Merge
description: This bot will farm materials in /abysslair and buy items from the merge shop
tags: legion, merge, staff, birthday, dage, evil, seasonal, event, darkbirthday, abysslair, abyssal, medalion, scale, coldfire, gem
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/AbyssalMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class AbyssalMerge {
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
                case "Abyssal Medallion":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(7392);
                    Core.huntMonster("abysslair", "Devourer of Souls", req.name, quant, { isTemp: false, log: false });
                    Core.cancelRegisteredQuests();
                    break;
                case "Abyssal Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7391);
                    Core.huntMonster("abysslair", "Abyssal Underbeast", req.name, quant, { isTemp: false, log: false });
                    Core.cancelRegisteredQuests();
                    break;
                case "Coldfire Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7390);
                    Core.huntMonster("abysslair", "Abyssal Guard", req.name, quant, { isTemp: false, log: false });
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("abysslair")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("abysslair", 1841, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "53276",
            "Underworld Evoker",
            'Mode: [select] only\nShould the bot buy "Underworld Evoker" ?',
            false,
        ),
        option.bool(
            "53277",
            "Empowered Underworld Evoker",
            'Mode: [select] only\nShould the bot buy "Empowered Underworld Evoker" ?',
            false,
        ),
        option.bool(
            "53278",
            "Underworld Evoker Shag",
            'Mode: [select] only\nShould the bot buy "Underworld Evoker Shag" ?',
            false,
        ),
        option.bool(
            "53279",
            "Underworld Evoker Ponytails",
            'Mode: [select] only\nShould the bot buy "Underworld Evoker Ponytails" ?',
            false,
        ),
        option.bool(
            "53280",
            "Underworld Evoker Cape",
            'Mode: [select] only\nShould the bot buy "Underworld Evoker Cape" ?',
            false,
        ),
        option.bool(
            "53281",
            "Underworld Evoker Vortex",
            'Mode: [select] only\nShould the bot buy "Underworld Evoker Vortex" ?',
            false,
        ),
        option.bool(
            "53282",
            "Underworld Evoker Vortices",
            'Mode: [select] only\nShould the bot buy "Underworld Evoker Vortices" ?',
            false,
        ),
        option.bool(
            "53602",
            "Bestial Sword of Fiend Control",
            'Mode: [select] only\nShould the bot buy "Bestial Sword of Fiend Control" ?',
            false,
        ),
        option.bool("53574", "Legion Minister", 'Mode: [select] only\nShould the bot buy "Legion Minister" ?', false),
        option.bool(
            "53575",
            "Legion Minister's Horned Locks",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Horned Locks" ?',
            false,
        ),
        option.bool(
            "53576",
            "Legion Minister's Locks",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Locks" ?',
            false,
        ),
        option.bool(
            "53577",
            "Legion Minister's Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Hat + Locks" ?',
            false,
        ),
        option.bool(
            "53579",
            "Legion Minister's Hair",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Hair" ?',
            false,
        ),
        option.bool(
            "53580",
            "Legion Minister's Hat",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Hat" ?',
            false,
        ),
        option.bool(
            "53581",
            "DarkCaster's Ministry",
            'Mode: [select] only\nShould the bot buy "DarkCaster\'s Ministry" ?',
            false,
        ),
        option.bool(
            "53582",
            "Legion Minister's Flight",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Flight" ?',
            false,
        ),
        option.bool(
            "53583",
            "DarkCaster's Winged Ministry",
            'Mode: [select] only\nShould the bot buy "DarkCaster\'s Winged Ministry" ?',
            false,
        ),
        option.bool(
            "53584",
            "Legion Minister's Fiend Hide",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Fiend Hide" ?',
            false,
        ),
        option.bool(
            "53585",
            "Legion Minister's Authority",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Authority" ?',
            false,
        ),
        option.bool("53586", "Zealith Busters", 'Mode: [select] only\nShould the bot buy "Zealith Busters" ?', false),
        option.bool(
            "53588",
            "Legion Minister's Stick",
            'Mode: [select] only\nShould the bot buy "Legion Minister\'s Stick" ?',
            false,
        ),
        option.bool("53589", "Soul Sipper far0", 'Mode: [select] only\nShould the bot buy "Soul Sipper far0" ?', false),
        option.bool(
            "76592",
            "Devouring Legion Rune",
            'Mode: [select] only\nShould the bot buy "Devouring Legion Rune" ?',
            false,
        ),
        option.bool(
            "76601",
            "Reaping Scythe of the Legion",
            'Mode: [select] only\nShould the bot buy "Reaping Scythe of the Legion" ?',
            false,
        ),
        option.bool(
            "76593",
            "Reaping Scythe of the Legion Cape",
            'Mode: [select] only\nShould the bot buy "Reaping Scythe of the Legion Cape" ?',
            false,
        ),
        option.bool(
            "68529",
            "Blade of Malevolence",
            'Mode: [select] only\nShould the bot buy "Blade of Malevolence" ?',
            false,
        ),
        option.bool(
            "68530",
            "Blades of Malevolence",
            'Mode: [select] only\nShould the bot buy "Blades of Malevolence" ?',
            false,
        ),
        option.bool(
            "68531",
            "Legion Malignant Blade",
            'Mode: [select] only\nShould the bot buy "Legion Malignant Blade" ?',
            false,
        ),
        option.bool(
            "68532",
            "Legion Malignant Blades",
            'Mode: [select] only\nShould the bot buy "Legion Malignant Blades" ?',
            false,
        ),
        option.bool(
            "76685",
            "Ascended Legion Evoker",
            'Mode: [select] only\nShould the bot buy "Ascended Legion Evoker" ?',
            false,
        ),
        option.bool(
            "76686",
            "Ascended Legion Evoker's Hair",
            'Mode: [select] only\nShould the bot buy "Ascended Legion Evoker\'s Hair" ?',
            false,
        ),
        option.bool(
            "76687",
            "Ascended Legion Evoker's Locks",
            'Mode: [select] only\nShould the bot buy "Ascended Legion Evoker\'s Locks" ?',
            false,
        ),
        option.bool(
            "76688",
            "Ascended Legion Evoker's Staff",
            'Mode: [select] only\nShould the bot buy "Ascended Legion Evoker\'s Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AbyssalMerge.select,
});

export default function main(): void {
    const script = new AbyssalMerge();
    Core.bankingBlackList.push("Abyssal Medallion", "Abyssal Scale", "Coldfire Gem", "Legion Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
