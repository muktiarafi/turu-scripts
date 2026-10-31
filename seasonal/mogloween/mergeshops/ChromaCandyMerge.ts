/*
name: Chroma Candy Merge
description: This will buy all the chroma candy and merge them.
tags: merge, mogloween, seasonal, candy, chroma
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/ChromaCandyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ChromaCandyMerge {
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
                case "Orange Dye":

                case "Green Dye":

                case "Yellow Dye":

                case "Black Dye":

                case "Purple Dye":

                case "Pink Dye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(6538);
                        Core.huntMonster("chromafection", "Chromafection", "Candy Dye", 3);
                        Core.ensureComplete(6538, req.id);
                    }
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("mogloween")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("chromafection", 1622, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "45197",
            "Pumpking Overlord",
            'Mode: [select] only\nShould the bot buy "Pumpking Overlord" ?',
            false,
        ),
        option.bool(
            "45198",
            "Possessed Pumpkin Helm",
            'Mode: [select] only\nShould the bot buy "Possessed Pumpkin Helm" ?',
            false,
        ),
        option.bool(
            "45199",
            "Hungry Pumpking Helm",
            'Mode: [select] only\nShould the bot buy "Hungry Pumpking Helm" ?',
            false,
        ),
        option.bool(
            "45200",
            "Blade of the Pumpking",
            'Mode: [select] only\nShould the bot buy "Blade of the Pumpking" ?',
            false,
        ),
        option.bool(
            "45201",
            "Daggers of the Pumpking",
            'Mode: [select] only\nShould the bot buy "Daggers of the Pumpking" ?',
            false,
        ),
        option.bool("45202", "A Gourdly Spirit", 'Mode: [select] only\nShould the bot buy "A Gourdly Spirit" ?', false),
        option.bool("45203", "Pumpkin Moglin", 'Mode: [select] only\nShould the bot buy "Pumpkin Moglin" ?', false),
        option.bool(
            "45204",
            "Ghostly Pumpkin Spirit",
            'Mode: [select] only\nShould the bot buy "Ghostly Pumpkin Spirit" ?',
            false,
        ),
        option.bool("45246", "Wacky Top Hat", 'Mode: [select] only\nShould the bot buy "Wacky Top Hat" ?', false),
        option.bool(
            "45247",
            "Wacky Top Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Wacky Top Hat + Locks" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ChromaCandyMerge.select,
});

export default function main(): void {
    const script = new ChromaCandyMerge();
    Core.bankingBlackList.push("Orange Dye", "Green Dye", "Yellow Dye", "Black Dye", "Purple Dye", "Pink Dye ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
