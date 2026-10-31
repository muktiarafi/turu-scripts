/*
name: Crescent Merge
description: This will buy all the merge items from the Crescent Merge Shop.
tags: merge, shop, crescent, seasonal, mogloween
*/
// Port of Scripts/Seasonal/Mogloween/MergeShops/CrescentMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CrescentMerge {
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
                case "Royce's Direclaw":

                case "Spectral Lycan":

                case "Spectral Lycan's Hood":

                case "Spectral Lycan's Morph":

                case "Spectral Lycan's Backfur":

                case "Howling Spectral Lycan":

                case "Spectral Ground Flames":

                case "Spectral Lycan's Spear":

                case "Spectral Lycan's Claws":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("crescentmoon", "Royce", req.name, quant, { isTemp: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("crescentmoon")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("crescentmoon", 2172, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "71271",
            "Enchanted Spectral Lycan",
            'Mode: [select] only\nShould the bot buy "Enchanted Spectral Lycan" ?',
            false,
        ),
        option.bool(
            "71272",
            "Enchanted Spectral Hood",
            'Mode: [select] only\nShould the bot buy "Enchanted Spectral Hood" ?',
            false,
        ),
        option.bool(
            "71273",
            "Enchanted Spectral Morph",
            'Mode: [select] only\nShould the bot buy "Enchanted Spectral Morph" ?',
            false,
        ),
        option.bool(
            "71274",
            "Enchanted Spectral Backfur",
            'Mode: [select] only\nShould the bot buy "Enchanted Spectral Backfur" ?',
            false,
        ),
        option.bool(
            "71275",
            "Enchanted Howling Lycan",
            'Mode: [select] only\nShould the bot buy "Enchanted Howling Lycan" ?',
            false,
        ),
        option.bool(
            "71276",
            "Enchanted Ground Flames",
            'Mode: [select] only\nShould the bot buy "Enchanted Ground Flames" ?',
            false,
        ),
        option.bool(
            "71277",
            "Enchanted Spectral Spear",
            'Mode: [select] only\nShould the bot buy "Enchanted Spectral Spear" ?',
            false,
        ),
        option.bool(
            "71278",
            "Enchanted Spectral Claws",
            'Mode: [select] only\nShould the bot buy "Enchanted Spectral Claws" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CrescentMerge.select,
});

export default function main(): void {
    const script = new CrescentMerge();
    Core.bankingBlackList.push(
        "Royce's Direclaw",
        "Spectral Lycan",
        "Spectral Lycan's Hood",
        "Spectral Lycan's Morph",
        "Spectral Lycan's Backfur",
        "Howling Spectral Lycan",
        "Spectral Ground Flames",
        "Spectral Lycan's Spear",
        "Spectral Lycan's Claws ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
