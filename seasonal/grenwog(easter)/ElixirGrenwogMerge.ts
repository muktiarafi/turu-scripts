/*
name: Elixir Grenwog Merge
description: This script will farm all the materials needed for Elixir Grenwog Merge in elixirgrenwog.
tags: elixir, seasonal, easter, grenwog, merge
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/ElixirGrenwogMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ElixirGrenwogMerge {
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
                case "Longevity Egg":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("elixirgrenwog", "Elixir Grenwog", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("elixirgrenwog", 2252, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "76026",
            "Pink Grenwog Garb",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Garb" ?',
            false,
        ),
        option.bool(
            "76027",
            "Pink-Band Battle Hair",
            'Mode: [select] only\nShould the bot buy "Pink-Band Battle Hair" ?',
            false,
        ),
        option.bool(
            "76028",
            "Pink-Barrette Battle Locks",
            'Mode: [select] only\nShould the bot buy "Pink-Barrette Battle Locks" ?',
            false,
        ),
        option.bool(
            "76029",
            "Pink Grenwog Tophat",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Tophat" ?',
            false,
        ),
        option.bool(
            "76030",
            "Pink Grenwog Tophat + Locks",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Tophat + Locks" ?',
            false,
        ),
        option.bool(
            "76031",
            "Pink Grenwog Ears",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Ears" ?',
            false,
        ),
        option.bool(
            "76032",
            "Pink Grenwog Locks",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Locks" ?',
            false,
        ),
        option.bool(
            "76033",
            "Pink Grenwog Carrot Kunai",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Carrot Kunai" ?',
            false,
        ),
        option.bool(
            "76034",
            "Pink Grenwog Carrot Kunais",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Carrot Kunais" ?',
            false,
        ),
        option.bool(
            "76035",
            "Pink Grenwog Watergun",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Watergun" ?',
            false,
        ),
        option.bool(
            "76036",
            "Pink Grenwog Waterguns",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Waterguns" ?',
            false,
        ),
        option.bool(
            "76037",
            "Pink Fists of Fury",
            'Mode: [select] only\nShould the bot buy "Pink Fists of Fury" ?',
            false,
        ),
        option.bool(
            "76038",
            "Pink Grenwog Cane",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Cane" ?',
            false,
        ),
        option.bool(
            "76039",
            "Pink Grenwog Canes",
            'Mode: [select] only\nShould the bot buy "Pink Grenwog Canes" ?',
            false,
        ),
        option.bool(
            "76054",
            "Pastel Grenwog Garb",
            'Mode: [select] only\nShould the bot buy "Pastel Grenwog Garb" ?',
            false,
        ),
        option.bool(
            "76055",
            "White-Band Battle Hair",
            'Mode: [select] only\nShould the bot buy "White-Band Battle Hair" ?',
            false,
        ),
        option.bool(
            "76056",
            "Pastel-Barrette Battle Locks",
            'Mode: [select] only\nShould the bot buy "Pastel-Barrette Battle Locks" ?',
            false,
        ),
        option.bool(
            "76057",
            "White Grenwog Tophat",
            'Mode: [select] only\nShould the bot buy "White Grenwog Tophat" ?',
            false,
        ),
        option.bool(
            "76058",
            "White Grenwog Tophat + Locks",
            'Mode: [select] only\nShould the bot buy "White Grenwog Tophat + Locks" ?',
            false,
        ),
        option.bool(
            "76059",
            "Pastel Grenwog Ears",
            'Mode: [select] only\nShould the bot buy "Pastel Grenwog Ears" ?',
            false,
        ),
        option.bool(
            "76060",
            "Pastel Grenwog Locks",
            'Mode: [select] only\nShould the bot buy "Pastel Grenwog Locks" ?',
            false,
        ),
        option.bool(
            "76061",
            "Pastel Grenwog Kunai",
            'Mode: [select] only\nShould the bot buy "Pastel Grenwog Kunai" ?',
            false,
        ),
        option.bool(
            "76062",
            "Pastel Grenwog Kunais",
            'Mode: [select] only\nShould the bot buy "Pastel Grenwog Kunais" ?',
            false,
        ),
        option.bool(
            "76063",
            "Pastel Grenwog Watergun",
            'Mode: [select] only\nShould the bot buy "Pastel Grenwog Watergun" ?',
            false,
        ),
        option.bool(
            "76064",
            "Pastel Grenwog Waterguns",
            'Mode: [select] only\nShould the bot buy "Pastel Grenwog Waterguns" ?',
            false,
        ),
        option.bool(
            "76065",
            "Pastel Fists of Fury",
            'Mode: [select] only\nShould the bot buy "Pastel Fists of Fury" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ElixirGrenwogMerge.select,
});

export default function main(): void {
    const script = new ElixirGrenwogMerge();
    Core.bankingBlackList.push("Longevity Egg");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
