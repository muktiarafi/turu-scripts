/*
name: Golden Merge
description: This bot will farm the items belonging to the selected mode for the Golden Merge [1490] in /goldenarena
tags: golden, merge, goldenarena, blessed, inquisitor, karok, queen, hope, dragon, banner, wings, female, horned, mace
*/
// Port of Scripts/Other/MergeShops/GoldenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { GoldenArena } from "../../story/queenofmonsters/extra/GoldenArena";

const Adv = new CoreAdvanced();
const GA = new GoldenArena();

export class GoldenMerge {
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
                //#region Known items
                case "Celestial Seal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Dragon", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Golden Scale":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Dragon", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Golden Rune":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Karok", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Golden Badge":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("goldenarena", "Blessed Inquisitor", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
                //#endregion
            }
        };
        GA.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("goldenarena", 1490, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "41864",
            "Blessed Inquisitor Armor",
            'Mode: [select] only\nShould the bot buy "Blessed Inquisitor Armor" ?',
            false,
        ),
        option.bool("41881", "Blessed Karok", 'Mode: [select] only\nShould the bot buy "Blessed Karok" ?', false),
        option.bool("41879", "Queen Of Hope", 'Mode: [select] only\nShould the bot buy "Queen Of Hope" ?', false),
        option.bool(
            "41797",
            "Golden Dragon Banner",
            'Mode: [select] only\nShould the bot buy "Golden Dragon Banner" ?',
            false,
        ),
        option.bool(
            "41867",
            "Blessed Inquisitor Cape",
            'Mode: [select] only\nShould the bot buy "Blessed Inquisitor Cape" ?',
            false,
        ),
        option.bool(
            "41884",
            "Blessed Karok Wings",
            'Mode: [select] only\nShould the bot buy "Blessed Karok Wings" ?',
            false,
        ),
        option.bool(
            "41885",
            "Queen Of Hope Wings",
            'Mode: [select] only\nShould the bot buy "Queen Of Hope Wings" ?',
            false,
        ),
        option.bool(
            "41865",
            "Blessed Inquisitor Female Helm",
            'Mode: [select] only\nShould the bot buy "Blessed Inquisitor Female Helm" ?',
            false,
        ),
        option.bool(
            "41866",
            "Blessed Inquisitor Helm",
            'Mode: [select] only\nShould the bot buy "Blessed Inquisitor Helm" ?',
            false,
        ),
        option.bool(
            "41882",
            "Blessed Karok Mask",
            'Mode: [select] only\nShould the bot buy "Blessed Karok Mask" ?',
            false,
        ),
        option.bool(
            "41883",
            "Blessed Karok Horned Mask",
            'Mode: [select] only\nShould the bot buy "Blessed Karok Horned Mask" ?',
            false,
        ),
        option.bool(
            "41880",
            "Queen Of Hope Helm",
            'Mode: [select] only\nShould the bot buy "Queen Of Hope Helm" ?',
            false,
        ),
        option.bool(
            "41868",
            "Mace of the Blessed Inquisitor",
            'Mode: [select] only\nShould the bot buy "Mace of the Blessed Inquisitor" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GoldenMerge.select,
});

export default function main(): void {
    const script = new GoldenMerge();
    Core.bankingBlackList.push("Celestial Seal", "Golden Scale", "Golden Rune", "Golden Badge");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
