/*
name: SevenCirclesMerge
description: null
tags: null
*/
// Port of Scripts/Legion/MergeShops/SevenCirclesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";
import { HeadoftheLegionBeast } from "../HeadOfTheLegionBeast";
import { SevenCircles } from "../../story/legion/SevenCircles(War)";

const Adv = new CoreAdvanced();
const Legion = new CoreLegion();
const Circles = new SevenCircles();
const headoftheLegionBeast = new HeadoftheLegionBeast();

export class SevenCirclesMerge {
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
                case "Indulgence":
                    headoftheLegionBeast.indulgence(quant);
                    break;
                case "Legion Token":
                    Legion.farmLegionToken(quant);
                    break;
            }
        };
        Circles.circles();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("sevencircles", 1980, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "54176",
            "Underworld Nemesis",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis" ?',
            false,
        ),
        option.bool(
            "54178",
            "Underworld Nemesis Horns + Locks",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Horns + Locks" ?',
            false,
        ),
        option.bool(
            "54179",
            "Underworld Nemesis Enchanted Horns + Locks",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Enchanted Horns + Locks" ?',
            false,
        ),
        option.bool(
            "54180",
            "Underworld Nemesis Dark Horns + Locks",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Dark Horns + Locks" ?',
            false,
        ),
        option.bool(
            "54182",
            "Underworld Nemesis Horns",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Horns" ?',
            false,
        ),
        option.bool(
            "54183",
            "Underworld Nemesis Enchanted Horns",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Enchanted Horns" ?',
            false,
        ),
        option.bool(
            "54184",
            "Underworld Nemesis Dark Horns",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Dark Horns" ?',
            false,
        ),
        option.bool(
            "54185",
            "Underworld Nemesis Dark Hood",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Dark Hood" ?',
            false,
        ),
        option.bool(
            "54186",
            "Underworld Nemesis Hood + Horns",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Hood + Horns" ?',
            false,
        ),
        option.bool(
            "54187",
            "One-Winged Underworld Nemesis",
            'Mode: [select] only\nShould the bot buy "One-Winged Underworld Nemesis" ?',
            false,
        ),
        option.bool(
            "54188",
            "Underworld Nemesis Wings",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Wings" ?',
            false,
        ),
        option.bool(
            "54189",
            "Underworld Nemesis Claws",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Claws" ?',
            false,
        ),
        option.bool(
            "54190",
            "Underworld Nemesis Kama",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Kama" ?',
            false,
        ),
        option.bool(
            "54191",
            "Underworld Nemesis Scythe",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Scythe" ?',
            false,
        ),
        option.bool(
            "59994",
            "Underworld Nemesis Kamas",
            'Mode: [select] only\nShould the bot buy "Underworld Nemesis Kamas" ?',
            false,
        ),
        option.bool(
            "59756",
            "Aspect of Luxuria",
            'Mode: [select] only\nShould the bot buy "Aspect of Luxuria" ?',
            false,
        ),
        option.bool("59753", "Gluttony's Maw", 'Mode: [select] only\nShould the bot buy "Gluttony\'s Maw" ?', false),
        option.bool("59752", "Stare of Greed", 'Mode: [select] only\nShould the bot buy "Stare of Greed" ?', false),
        option.bool(
            "59757",
            "Luxuria's Daggers",
            'Mode: [select] only\nShould the bot buy "Luxuria\'s Daggers" ?',
            false,
        ),
        option.bool(
            "59758",
            "Luxuria's Reversed Daggers",
            'Mode: [select] only\nShould the bot buy "Luxuria\'s Reversed Daggers" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SevenCirclesMerge.select,
});

export default function main(): void {
    const script = new SevenCirclesMerge();
    Core.bankingBlackList.push("Indulgence", "Legion Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
