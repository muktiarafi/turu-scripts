/*
name: Lavarock Merge
description: This bot will farm the items belonging to the selected mode for the Lavarock Merge [2292] in /lavarockbay
tags: lavarock, merge, lavarockbay, fiery, fissure, scythe, molten, lava, orb, orbs, guardian, frilled, horned, sheathed, kalayos, oath, oaths
*/
// Port of Scripts/Seasonal/SummerBreak/LavarockMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LavarockMerge {
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
                case "Volcanic Fragment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.killMonster("lavarockbay", "r2", "Left", "*", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        Core.logger("This boss requires a strong solo class or army. Do not proceed if you can't beat the boss.");
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lavarockbay", 2292, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "13772",
            "Fiery Fissure Scythe",
            'Mode: [select] only\nShould the bot buy "Fiery Fissure Scythe" ?',
            false,
        ),
        option.bool("78100", "Molten Lava Orb", 'Mode: [select] only\nShould the bot buy "Molten Lava Orb" ?', false),
        option.bool("78101", "Molten Lava Orbs", 'Mode: [select] only\nShould the bot buy "Molten Lava Orbs" ?', false),
        option.bool(
            "78102",
            "Lavarock Guardian",
            'Mode: [select] only\nShould the bot buy "Lavarock Guardian" ?',
            false,
        ),
        option.bool(
            "78103",
            "Lavarock Guardian Frilled Helm",
            'Mode: [select] only\nShould the bot buy "Lavarock Guardian Frilled Helm" ?',
            false,
        ),
        option.bool(
            "78104",
            "Lavarock Guardian Horned Helm",
            'Mode: [select] only\nShould the bot buy "Lavarock Guardian Horned Helm" ?',
            false,
        ),
        option.bool(
            "78105",
            "Lavarock Guardian Sheathed Blade",
            'Mode: [select] only\nShould the bot buy "Lavarock Guardian Sheathed Blade" ?',
            false,
        ),
        option.bool("78107", "Kalayo's Oath", 'Mode: [select] only\nShould the bot buy "Kalayo\'s Oath" ?', false),
        option.bool("78110", "Kalayo's Oaths", 'Mode: [select] only\nShould the bot buy "Kalayo\'s Oaths" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LavarockMerge.select,
});

export default function main(): void {
    const script = new LavarockMerge();
    Core.bankingBlackList.push("Volcanic Fragment");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
