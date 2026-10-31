/*
name: Astravia Past Merge
description: Astravia Past Merge
tags: astravia past, merge, mergeshop
*/
// Port of Scripts/Darkon/MergeShops/AstraviaPastMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDarkon } from "../CoreDarkon";

const Adv = new CoreAdvanced();
const Darkon = new CoreDarkon();

export class AstraviaPastMerge {
    // [Can Change] This should only be changed by the author.
    //              If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    buyAllMerge(buyOnlyThis: string | null = null, buyMode: mergeOptionsEnum | null = null): void {
        const findIngredients = (): void => {
            const req = Adv.externalItem;
            const quant = Adv.externalQuant;
            const currentQuant = req.temp ? bot.tempInv.getQuantity(req.name) : bot.inventory.getQuantity(req.name);
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
                // Add how to get items here
                case "Suki's Prestige":
                    Core.logger(`Farming ${req.name} (${currentQuant}/${quant})`);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Darkon.sukisPrestiege(quant);
                    }
                    break;
                case "Prince Drago's Attire":

                case "Prince Drago's Hair":

                case "Prince Drago's Dark Attire":
                    Core.huntMonster("astraviapast", "Forsaken Husk", req.name, undefined, { isTemp: false });
                    break;
                case "Suki's Casual Armor":

                case "Suki's Ponytail":
                    Core.huntMonster("astraviapast", "Aurola", req.name, undefined, { isTemp: false });
                    break;
                case "Regulus' Hair":
                    Core.huntMonster("astraviapast", "Regulus", req.name, undefined, { isTemp: false });
                    break;
                case "Titania's Hair":
                    Core.huntMonster("astraviapast", "Titania", req.name, undefined, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("astraviapast", 2126, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "69155",
            "Prince Drago's Royal Attire",
            'Mode: [select] only\nShould the bot buy "Prince Drago\'s Royal Attire" ?',
            false,
        ),
        option.bool(
            "69156",
            "Prince Drago's Royal Dark Attire",
            'Mode: [select] only\nShould the bot buy "Prince Drago\'s Royal Dark Attire" ?',
            false,
        ),
        option.bool(
            "69158",
            "Prince Drago's Morph",
            'Mode: [select] only\nShould the bot buy "Prince Drago\'s Morph" ?',
            false,
        ),
        option.bool(
            "69159",
            "Prince Drago's Scarred Morph",
            'Mode: [select] only\nShould the bot buy "Prince Drago\'s Scarred Morph" ?',
            false,
        ),
        option.bool("69160", "Suki's Armor", 'Mode: [select] only\nShould the bot buy "Suki\'s Armor" ?', false),
        option.bool("69163", "Suki's Morph", 'Mode: [select] only\nShould the bot buy "Suki\'s Morph" ?', false),
        option.bool(
            "69164",
            "Suki's Gauntlets",
            'Mode: [select] only\nShould the bot buy "Suki\'s Gauntlets" ?',
            false,
        ),
        option.bool("69166", "Regulus' Morph", 'Mode: [select] only\nShould the bot buy "Regulus\' Morph" ?', false),
        option.bool("69168", "Titania's Morph", 'Mode: [select] only\nShould the bot buy "Titania\'s Morph" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AstraviaPastMerge.select,
});

export default function main(): void {
    const script = new AstraviaPastMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
