/*
name: ChronoGem Merge
description: This bot will farm the items belonging to the selected mode for the ChronoGem Merge [2386] in /chronogem
tags: new year, chronogem, merge, chronogem, quantum, centurion, galea, chrono, circlet, coronal, countdown, meridian, epoch, definer, pilum, destructive, decennium, shield
*/
// Port of Scripts/Seasonal/NewYear/ChronoGemMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreNewYear } from "./CoreNewYear";

const Adv = new CoreAdvanced();
const NY = new CoreNewYear();

export class ChronoGemMerge {
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
                case "Chrono Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9536);
                    Core.huntMonster("chronogem", "Gem Forgemaster", req.name, quant, { isTemp: req.temp, log: false });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        NY.chronoForge();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("chronogem", 2386, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "82913",
            "Quantum Centurion",
            'Mode: [select] only\nShould the bot buy "Quantum Centurion" ?',
            false,
        ),
        option.bool(
            "82914",
            "Quantum Centurion Galea",
            'Mode: [select] only\nShould the bot buy "Quantum Centurion Galea" ?',
            false,
        ),
        option.bool(
            "82915",
            "Quantum Centurion Helm",
            'Mode: [select] only\nShould the bot buy "Quantum Centurion Helm" ?',
            false,
        ),
        option.bool(
            "82721",
            "Chrono Centurion Circlet",
            'Mode: [select] only\nShould the bot buy "Chrono Centurion Circlet" ?',
            false,
        ),
        option.bool(
            "82722",
            "Chrono Centurion Coronal",
            'Mode: [select] only\nShould the bot buy "Chrono Centurion Coronal" ?',
            false,
        ),
        option.bool(
            "82723",
            "Chrono Centurion Hair",
            'Mode: [select] only\nShould the bot buy "Chrono Centurion Hair" ?',
            false,
        ),
        option.bool(
            "82724",
            "Chrono Centurion Locks",
            'Mode: [select] only\nShould the bot buy "Chrono Centurion Locks" ?',
            false,
        ),
        option.bool(
            "82916",
            "Quantum Centurion Cape",
            'Mode: [select] only\nShould the bot buy "Quantum Centurion Cape" ?',
            false,
        ),
        option.bool(
            "82917",
            "Quantum Centurion Countdown",
            'Mode: [select] only\nShould the bot buy "Quantum Centurion Countdown" ?',
            false,
        ),
        option.bool(
            "82918",
            "Quantum Centurion Meridian",
            'Mode: [select] only\nShould the bot buy "Quantum Centurion Meridian" ?',
            false,
        ),
        option.bool(
            "82920",
            "Epoch Definer Blade",
            'Mode: [select] only\nShould the bot buy "Epoch Definer Blade" ?',
            false,
        ),
        option.bool(
            "82921",
            "Epoch Definer Pilum",
            'Mode: [select] only\nShould the bot buy "Epoch Definer Pilum" ?',
            false,
        ),
        option.bool(
            "82922",
            "Destructive Decennium",
            'Mode: [select] only\nShould the bot buy "Destructive Decennium" ?',
            false,
        ),
        option.bool(
            "82923",
            "Epoch Definer Blade and Shield",
            'Mode: [select] only\nShould the bot buy "Epoch Definer Blade and Shield" ?',
            false,
        ),
        option.bool(
            "82924",
            "Epoch Definer Pilum and Shield",
            'Mode: [select] only\nShould the bot buy "Epoch Definer Pilum and Shield" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ChronoGemMerge.select,
});

export default function main(): void {
    const script = new ChronoGemMerge();
    Core.bankingBlackList.push("Chrono Gem");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
