/*
name: ShadowFall Merge
description: This bot will farm the items belonging to the selected mode for the ShadowFall Merge [291] in /shadowfallwar
tags: shadowfall, merge, shadowfallwar, unholy, tormenter, great, grave, terror, terrors, lich, bane, creature, royal, crown, torch, darkness, bounded, ectoplasmic, skull, mace, doublesided, painblade, accoutrements, skelecommander, skelecommanders, necrotic, bonefang, doom
*/
// Port of Scripts/Evil/ShadowFallMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class ShadowFallMerge {
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
                //#region Items not setup
                case "Necrotic Darkness Gem":

                case "Tortured Darkness Gem":

                case "Malignant Darkness Gem":

                case "Ultimate Darkness Gem":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.killMonster("shadowfallwar", "Garden2", "Left", "*", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowfallwar", 291, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("8547", "The Unholy", 'Mode: [select] only\nShould the bot buy "The Unholy" ?', false),
        option.bool("8548", "The Tormenter", 'Mode: [select] only\nShould the bot buy "The Tormenter" ?', false),
        option.bool(
            "8549",
            "The Great Grave Blade",
            'Mode: [select] only\nShould the bot buy "The Great Grave Blade" ?',
            false,
        ),
        option.bool("8551", "Grave Terror", 'Mode: [select] only\nShould the bot buy "Grave Terror" ?', false),
        option.bool(
            "8552",
            "Dual Grave Terrors",
            'Mode: [select] only\nShould the bot buy "Dual Grave Terrors" ?',
            false,
        ),
        option.bool("8553", "Lich Bane", 'Mode: [select] only\nShould the bot buy "Lich Bane" ?', false),
        option.bool("8556", "The Creature", 'Mode: [select] only\nShould the bot buy "The Creature" ?', false),
        option.bool("8557", "Hooded Creature", 'Mode: [select] only\nShould the bot buy "Hooded Creature" ?', false),
        option.bool("8561", "Royal Lich Crown", 'Mode: [select] only\nShould the bot buy "Royal Lich Crown" ?', false),
        option.bool(
            "8583",
            "Torch of Darkness",
            'Mode: [select] only\nShould the bot buy "Torch of Darkness" ?',
            false,
        ),
        option.bool("8571", "Bounded Blade", 'Mode: [select] only\nShould the bot buy "Bounded Blade" ?', false),
        option.bool(
            "8588",
            "Ectoplasmic Skull Mace",
            'Mode: [select] only\nShould the bot buy "Ectoplasmic Skull Mace" ?',
            false,
        ),
        option.bool(
            "8596",
            "DoubleSided PainBlade",
            'Mode: [select] only\nShould the bot buy "DoubleSided PainBlade" ?',
            false,
        ),
        option.bool(
            "8599",
            "PainBlade Accoutrements",
            'Mode: [select] only\nShould the bot buy "PainBlade Accoutrements" ?',
            false,
        ),
        option.bool("8600", "SkeleCommander", 'Mode: [select] only\nShould the bot buy "SkeleCommander" ?', false),
        option.bool(
            "8601",
            "SkeleCommander's Cape",
            'Mode: [select] only\nShould the bot buy "SkeleCommander\'s Cape" ?',
            false,
        ),
        option.bool(
            "8602",
            "SkeleCommander's Helm",
            'Mode: [select] only\nShould the bot buy "SkeleCommander\'s Helm" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowFallMerge.select,
});

export default function main(): void {
    const script = new ShadowFallMerge();
    Core.bankingBlackList.push(
        "Necrotic Darkness Gem",
        "Tortured Darkness Gem",
        "Malignant Darkness Gem",
        "Ultimate Darkness Gem",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
