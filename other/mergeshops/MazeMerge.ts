/*
name: MazeMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/MazeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MazeMerge {
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
                case "Mehensi Fang":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("whitehole", "Mehensi Serpent", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("whitehole", 1273, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("35571", "Black Hole Spear", 'Mode: [select] only\nShould the bot buy "Black Hole Spear" ?', false),
        option.bool("35572", "Black Hole Sword", 'Mode: [select] only\nShould the bot buy "Black Hole Sword" ?', false),
        option.bool(
            "35574",
            "Colossal Black Hole Sword",
            'Mode: [select] only\nShould the bot buy "Colossal Black Hole Sword" ?',
            false,
        ),
        option.bool(
            "35499",
            "Dark Flaming Fists",
            'Mode: [select] only\nShould the bot buy "Dark Flaming Fists" ?',
            false,
        ),
        option.bool("35579", "Void Wanderer", 'Mode: [select] only\nShould the bot buy "Void Wanderer" ?', false),
        option.bool("35576", "Dark Matter Cape", 'Mode: [select] only\nShould the bot buy "Dark Matter Cape" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: MazeMerge.select,
});

export default function main(): void {
    const script = new MazeMerge();
    Core.bankingBlackList.push("Mehensi Fang ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
