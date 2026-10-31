/*
name: Spoils of Light Merge
description: This bot will farm the items belonging to the selected mode for the Spoils of Light Merge [1643] in /lightguardwar
tags: spoils, of, light, merge, lightguardwar, crusader, furred, runed, morph, high, ruff, inquisitor, inquisitors, bright
*/
// Port of Scripts/Other/MergeShops/SpoilsofLightMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class SpoilsofLightMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
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
                case "Apprentice of the Light":

                case "Furred Ruff of the Light":

                case "Apprentice of the Light Hair":

                case "Apprentice of the Light Locks":

                case "Citadel's Light Blade":

                case "Medal of Light":

                case "Medal of Honor":

                case "Medal of Justice":
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    // Combine all relevant quest IDs into one registration
                    Core.registerQuests(6560, 6561, 6562, 6563, 6566);
                    Core.killMonster("lightguardwar", "r2", "Left", "Citadel Crusader", req.name, req.quantity, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lightguardwar", 1643, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "45396",
            "Crusader of the Light",
            'Mode: [select] only\nShould the bot buy "Crusader of the Light" ?',
            false,
        ),
        option.bool(
            "45399",
            "Furred Cape of the Light",
            'Mode: [select] only\nShould the bot buy "Furred Cape of the Light" ?',
            false,
        ),
        option.bool(
            "45397",
            "Runed Crusader Morph",
            'Mode: [select] only\nShould the bot buy "Runed Crusader Morph" ?',
            false,
        ),
        option.bool(
            "45398",
            "Runed Crusader Locks",
            'Mode: [select] only\nShould the bot buy "Runed Crusader Locks" ?',
            false,
        ),
        option.bool("45400", "High Crusader", 'Mode: [select] only\nShould the bot buy "High Crusader" ?', false),
        option.bool(
            "45401",
            "High Crusader Morph",
            'Mode: [select] only\nShould the bot buy "High Crusader Morph" ?',
            false,
        ),
        option.bool(
            "45402",
            "High Crusader Locks",
            'Mode: [select] only\nShould the bot buy "High Crusader Locks" ?',
            false,
        ),
        option.bool(
            "45404",
            "High Crusader Light Blade",
            'Mode: [select] only\nShould the bot buy "High Crusader Light Blade" ?',
            false,
        ),
        option.bool(
            "45403",
            "Blade + Ruff of the Light",
            'Mode: [select] only\nShould the bot buy "Blade + Ruff of the Light" ?',
            false,
        ),
        option.bool(
            "45405",
            "Inquisitor of the Light",
            'Mode: [select] only\nShould the bot buy "Inquisitor of the Light" ?',
            false,
        ),
        option.bool(
            "45406",
            "Inquisitor's Helm of the Light",
            'Mode: [select] only\nShould the bot buy "Inquisitor\'s Helm of the Light" ?',
            false,
        ),
        option.bool(
            "45407",
            "Inquisitor's Locks of the Light",
            'Mode: [select] only\nShould the bot buy "Inquisitor\'s Locks of the Light" ?',
            false,
        ),
        option.bool(
            "45409",
            "Inquisitor's Bright Blade",
            'Mode: [select] only\nShould the bot buy "Inquisitor\'s Bright Blade" ?',
            false,
        ),
        option.bool(
            "45408",
            "Ruff, Blade and Cape of the Light",
            'Mode: [select] only\nShould the bot buy "Ruff, Blade and Cape of the Light" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SpoilsofLightMerge.select,
});

export default function main(): void {
    const script = new SpoilsofLightMerge();
    Core.bankingBlackList.push(
        "Apprentice of the Light",
        "Medal of Light",
        "Furred Ruff of the Light",
        "Apprentice of the Light Hair",
        "Apprentice of the Light Locks",
        "Medal of Honor",
        "Citadel's Light Blade",
        "Medal of Justice",
    );

    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
