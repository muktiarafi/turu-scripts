/*
name: Genesis Garden Merge
description: Genesis Garden Merge
tags: darkon, genesisgarden, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/GenesisGardenMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";
import { CoreAstravia } from "../../story/elegyofmadness(darkon)/CoreAstravia";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();
const CAstravia = new CoreAstravia();

export class GenesisGardenMerge {
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
                case "Mourning Flower":
                    Darkon.wheelofFortune(quant, 0);
                    break;
                case "Jus Divinum Scale":
                    Darkon.wheelofFortune(0, quant);
                    break;
            }
        };
        CAstravia.genesisGarden();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("genesisgarden", 2136, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70354",
            "Prince Darkon's Armor",
            'Mode: [select] only\nShould the bot buy "Prince Darkon\'s Armor" ?',
            false,
        ),
        option.bool(
            "70355",
            "Prince Darkon's Casual Armor",
            'Mode: [select] only\nShould the bot buy "Prince Darkon\'s Casual Armor" ?',
            false,
        ),
        option.bool(
            "70356",
            "Prince Darkon's Scarred Hair",
            'Mode: [select] only\nShould the bot buy "Prince Darkon\'s Scarred Hair" ?',
            false,
        ),
        option.bool(
            "70357",
            "Prince Darkon's Scarred Morph",
            'Mode: [select] only\nShould the bot buy "Prince Darkon\'s Scarred Morph" ?',
            false,
        ),
        option.bool(
            "70358",
            "So's Student Uniform",
            'Mode: [select] only\nShould the bot buy "So\'s Student Uniform" ?',
            false,
        ),
        option.bool(
            "70359",
            "So's Student Hair",
            'Mode: [select] only\nShould the bot buy "So\'s Student Hair" ?',
            false,
        ),
        option.bool(
            "70360",
            "So's Student Morph",
            'Mode: [select] only\nShould the bot buy "So\'s Student Morph" ?',
            false,
        ),
        option.bool(
            "70361",
            "Jus Divinum Major",
            'Mode: [select] only\nShould the bot buy "Jus Divinum Major" ?',
            false,
        ),
        option.bool(
            "70362",
            "Jus Divinum Major Helmet",
            'Mode: [select] only\nShould the bot buy "Jus Divinum Major Helmet" ?',
            false,
        ),
        option.bool(
            "70363",
            "Jus Divinum Major Cape",
            'Mode: [select] only\nShould the bot buy "Jus Divinum Major Cape" ?',
            false,
        ),
        option.bool(
            "77884",
            "Jus Divinum Lieutenant",
            'Mode: [select] only\nShould the bot buy "Jus Divinum Lieutenant" ?',
            false,
        ),
        option.bool(
            "77885",
            "Jus Divinum Lieutenant Armet",
            'Mode: [select] only\nShould the bot buy "Jus Divinum Lieutenant Armet" ?',
            false,
        ),
        option.bool(
            "77886",
            "Jus Divinum Lieutenant Cloak",
            'Mode: [select] only\nShould the bot buy "Jus Divinum Lieutenant Cloak" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GenesisGardenMerge.select,
});

export default function main(): void {
    const script = new GenesisGardenMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
