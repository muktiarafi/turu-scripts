/*
name: FutureWarMerge
description: Merges Dage's Seasonal staff birthday and has the Shogun Paragon pet for LT
tags: Shogun Paragon, Legion Token
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/FutureWarMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreLegion } from "../../../legion/CoreLegion";
import { CoreDageBirthday } from "./CoreDageBirthday";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const Dage = new CoreDageBirthday();

export class FutureWarMerge {
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
                case "UnDeath Core":

                case "ProtoSoul Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("futurewar", "SF3017 Paragonator", req.name, quant, { log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("futurewar")) {
            return;
        }

        Dage.futureLegion();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("futurewar", 1378, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "38790",
            "Eternal Dark Caster",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster" ?',
            false,
        ),
        option.bool(
            "38782",
            "Eternal Dark Caster X Hood",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster X Hood" ?',
            false,
        ),
        option.bool(
            "38785",
            "Eternal Dark Caster Runes",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster Runes" ?',
            false,
        ),
        option.bool(
            "38786",
            "Eternal Infernal Dark Wings",
            'Mode: [select] only\nShould the bot buy "Eternal Infernal Dark Wings" ?',
            false,
        ),
        option.bool(
            "38787",
            "Eternal Dark Caster Wings",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster Wings" ?',
            false,
        ),
        option.bool(
            "38788",
            "Eternal Dark Caster Winged Rune",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster Winged Rune" ?',
            false,
        ),
        option.bool(
            "38783",
            "Eternal Dark Caster X Spikes",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster X Spikes" ?',
            false,
        ),
        option.bool(
            "38784",
            "Eternal Dark Caster X Locks",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster X Locks" ?',
            false,
        ),
        option.bool(
            "38789",
            "Eternal Dark Caster X",
            'Mode: [select] only\nShould the bot buy "Eternal Dark Caster X" ?',
            false,
        ),
        option.bool(
            "38761",
            "Dreadnaught House",
            'Mode: [select] only\nShould the bot buy "Dreadnaught House" ?',
            false,
        ),
        option.bool("38615", "SF 3017 Armor", 'Mode: [select] only\nShould the bot buy "SF 3017 Armor" ?', false),
        option.bool(
            "38638",
            "ProtoParagon Samurai Helm",
            'Mode: [select] only\nShould the bot buy "ProtoParagon Samurai Helm" ?',
            false,
        ),
        option.bool(
            "38644",
            "ProtoParagon Samurai Skull",
            'Mode: [select] only\nShould the bot buy "ProtoParagon Samurai Skull" ?',
            false,
        ),
        option.bool("38616", "Uw3017 Blaster", 'Mode: [select] only\nShould the bot buy "Uw3017 Blaster" ?', false),
        option.bool("38719", "Proto Blasters", 'Mode: [select] only\nShould the bot buy "Proto Blasters" ?', false),
        option.bool("38718", "Proto Blaster", 'Mode: [select] only\nShould the bot buy "Proto Blaster" ?', false),
        option.bool(
            "38716",
            "Uw3017 Blaster Mask",
            'Mode: [select] only\nShould the bot buy "Uw3017 Blaster Mask" ?',
            false,
        ),
        option.bool("38664", "Uw3017 Helm", 'Mode: [select] only\nShould the bot buy "Uw3017 Helm" ?', false),
        option.bool("38631", "Uw3017 Cape", 'Mode: [select] only\nShould the bot buy "Uw3017 Cape" ?', false),
        option.bool(
            "38648",
            "Uw3017 Hooded Mask",
            'Mode: [select] only\nShould the bot buy "Uw3017 Hooded Mask" ?',
            false,
        ),
        option.bool(
            "38643",
            "ProtoParagon Samurai Mask + Scarf",
            'Mode: [select] only\nShould the bot buy "ProtoParagon Samurai Mask + Scarf" ?',
            false,
        ),
        option.bool(
            "38642",
            "ProtoParagon Samurai Mask",
            'Mode: [select] only\nShould the bot buy "ProtoParagon Samurai Mask" ?',
            false,
        ),
        option.bool(
            "38641",
            "ProtoParagon Samurai Hood",
            'Mode: [select] only\nShould the bot buy "ProtoParagon Samurai Hood" ?',
            false,
        ),
        option.bool(
            "38621",
            "Shogun Paragon Pet",
            'Mode: [select] only\nShould the bot buy "Shogun Paragon Pet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FutureWarMerge.select,
});

export default function main(): void {
    const script = new FutureWarMerge();
    Core.bankingBlackList.push("Legion Token", "ProtoSoul Gem", "UnDeath Core");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
