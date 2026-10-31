/*
name: Astravia Castle Merge
description: Astravia Castle Merge
tags: astravia castle, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/AstraviaCastleMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class AstraviaCastleMerge {
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
                case "Astravian Medal":
                    Core.farmingLogger(req.name, quant);
                    Darkon.astravianMedal(quant);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("astraviacastle", 2043, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "62788",
            "Astravian Musician",
            'Mode: [select] only\nShould the bot buy "Astravian Musician" ?',
            false,
        ),
        option.bool(
            "62790",
            "Astravian Musician's Hair",
            'Mode: [select] only\nShould the bot buy "Astravian Musician\'s Hair" ?',
            false,
        ),
        option.bool(
            "62791",
            "Astravian Musician's Locks",
            'Mode: [select] only\nShould the bot buy "Astravian Musician\'s Locks" ?',
            false,
        ),
        option.bool(
            "62796",
            "Astravian Violinist's Bow",
            'Mode: [select] only\nShould the bot buy "Astravian Violinist\'s Bow" ?',
            false,
        ),
        option.bool(
            "62913",
            "Astravian Royal Guard",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Guard" ?',
            false,
        ),
        option.bool(
            "62914",
            "Astravian Royal Guard's Helmet",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Guard\'s Helmet" ?',
            false,
        ),
        option.bool(
            "62915",
            "Astravian Royal Wings",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Wings" ?',
            false,
        ),
        option.bool(
            "62794",
            "Astravian Sheathed Rapier",
            'Mode: [select] only\nShould the bot buy "Astravian Sheathed Rapier" ?',
            false,
        ),
        option.bool(
            "62916",
            "Astravian Royal Sword",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Sword" ?',
            false,
        ),
        option.bool(
            "62795",
            "Astravian Royal Rapier",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Rapier" ?',
            false,
        ),
        option.bool(
            "62917",
            "Astravian Royal Staff",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Staff" ?',
            false,
        ),
        option.bool(
            "62918",
            "Astravian Royal Daggers",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Daggers" ?',
            false,
        ),
        option.bool("63000", "Drago's Attire", 'Mode: [select] only\nShould the bot buy "Drago\'s Attire" ?', false),
        option.bool(
            "63001",
            "Drago's Cloaked Attire",
            'Mode: [select] only\nShould the bot buy "Drago\'s Cloaked Attire" ?',
            false,
        ),
        option.bool(
            "63003",
            "Drago's Short Hair",
            'Mode: [select] only\nShould the bot buy "Drago\'s Short Hair" ?',
            false,
        ),
        option.bool("63002", "Drago's Hair", 'Mode: [select] only\nShould the bot buy "Drago\'s Hair" ?', false),
        option.bool("63004", "Drago's Beard", 'Mode: [select] only\nShould the bot buy "Drago\'s Beard" ?', false),
        option.bool(
            "63006",
            "Drago's Red Cloak",
            'Mode: [select] only\nShould the bot buy "Drago\'s Red Cloak" ?',
            false,
        ),
        option.bool("63005", "Drago's Cloak", 'Mode: [select] only\nShould the bot buy "Drago\'s Cloak" ?', false),
        option.bool(
            "63011",
            "Astravian Royal Spear",
            'Mode: [select] only\nShould the bot buy "Astravian Royal Spear" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AstraviaCastleMerge.select,
});

export default function main(): void {
    const script = new AstraviaCastleMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
