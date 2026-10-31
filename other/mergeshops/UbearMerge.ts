/*
name: Ubear Merge
description: This bot will farm the items belonging to the selected mode for the Ubear Merge [1849] in /ubear
tags: ubear, merge, ubear, old, skewl, pet, mystical, plank, awe, doomkeknight, legion, peace, ducky, double, trobble, team, not, so, invisible, ninja, raaaaageface, morph
*/
// Port of Scripts/Other/MergeShops/UbearMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreLegion } from "../../legion/CoreLegion";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();

export class UbearMerge {
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
                case "Ubear X Pass":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("limft", "Ubear", req.name, quant, { isTemp: false });
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ubear", 1849, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("54015", "Old Skewl Helm", 'Mode: [select] only\nShould the bot buy "Old Skewl Helm" ?', false),
        option.bool("54016", "Old Skewl Locks", 'Mode: [select] only\nShould the bot buy "Old Skewl Locks" ?', false),
        option.bool("54017", "Old Skewl Pet", 'Mode: [select] only\nShould the bot buy "Old Skewl Pet" ?', false),
        option.bool(
            "54030",
            "Mystical Plank Of Awe",
            'Mode: [select] only\nShould the bot buy "Mystical Plank Of Awe" ?',
            false,
        ),
        option.bool(
            "54018",
            "DoomKeKnight Helm",
            'Mode: [select] only\nShould the bot buy "DoomKeKnight Helm" ?',
            false,
        ),
        option.bool(
            "54019",
            "Legion DoomKeKnight Helm",
            'Mode: [select] only\nShould the bot buy "Legion DoomKeKnight Helm" ?',
            false,
        ),
        option.bool("54022", "Peace Ducky Pet", 'Mode: [select] only\nShould the bot buy "Peace Ducky Pet" ?', false),
        option.bool(
            "54020",
            "Double Trobble Pet",
            'Mode: [select] only\nShould the bot buy "Double Trobble Pet" ?',
            false,
        ),
        option.bool(
            "54021",
            "Team Double Trobble Pet",
            'Mode: [select] only\nShould the bot buy "Team Double Trobble Pet" ?',
            false,
        ),
        option.bool(
            "54034",
            "Not So Invisible Ninja",
            'Mode: [select] only\nShould the bot buy "Not So Invisible Ninja" ?',
            false,
        ),
        option.bool(
            "18491",
            "RAAAAAGEFACE Visage",
            'Mode: [select] only\nShould the bot buy "RAAAAAGEFACE Visage" ?',
            false,
        ),
        option.bool(
            "91714",
            "RAAAAAGEFACE Morph",
            'Mode: [select] only\nShould the bot buy "RAAAAAGEFACE Morph" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: UbearMerge.select,
});

export default function main(): void {
    const script = new UbearMerge();
    Core.bankingBlackList.push("Ubear X Pass", "Legion Token");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
