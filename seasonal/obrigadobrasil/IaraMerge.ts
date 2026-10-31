/*
name: Iara Merge
description: This bot will farm the items belonging to the selected mode for the Iara Merge [2047] in /iara
tags: iara, merge, iara, iaras, morph, symbol, bubbles, harp, acolyte, acolytes, flowered, coral, brush, water, orb
*/
// Port of Scripts/Seasonal/ObrigadoBrasil/IaraMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Iara } from "./IaraStory";

const Adv = new CoreAdvanced();
const I = new Iara();

export class IaraMerge {
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
                case "Keeper of the Amazon":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8261);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("iara", "Iara", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Iara Insignia":
                    Core.logger(`${req.name}` + " requires ultra boss, you need to farm it manually.", undefined, {
                        stopBot: true,
                    });
                    break;
            }
        };
        I.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("iara", 2047, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("62821", "Iara's Armor", 'Mode: [select] only\nShould the bot buy "Iara\'s Armor" ?', false),
        option.bool("62822", "Iara's Morph", 'Mode: [select] only\nShould the bot buy "Iara\'s Morph" ?', false),
        option.bool("62823", "Symbol of Iara", 'Mode: [select] only\nShould the bot buy "Symbol of Iara" ?', false),
        option.bool("63162", "Iara's Bubbles", 'Mode: [select] only\nShould the bot buy "Iara\'s Bubbles" ?', false),
        option.bool("63132", "Iara's Harp", 'Mode: [select] only\nShould the bot buy "Iara\'s Harp" ?', false),
        option.bool("63156", "Iara's Acolyte", 'Mode: [select] only\nShould the bot buy "Iara\'s Acolyte" ?', false),
        option.bool(
            "63157",
            "Iara's Acolyte's Hair",
            "Mode: [select] only\nShould the bot buy \"Iara's Acolyte's Hair\" ?",
            false,
        ),
        option.bool(
            "63158",
            "Iara's Acolyte's Morph Hair",
            "Mode: [select] only\nShould the bot buy \"Iara's Acolyte's Morph Hair\" ?",
            false,
        ),
        option.bool(
            "63159",
            "Iara's Acolyte's Flowered Locks",
            "Mode: [select] only\nShould the bot buy \"Iara's Acolyte's Flowered Locks\" ?",
            false,
        ),
        option.bool(
            "63160",
            "Iara's Acolyte's Flowered Morph Locks",
            "Mode: [select] only\nShould the bot buy \"Iara's Acolyte's Flowered Morph Locks\" ?",
            false,
        ),
        option.bool(
            "63161",
            "Iara's Acolyte's Locks",
            "Mode: [select] only\nShould the bot buy \"Iara's Acolyte's Locks\" ?",
            false,
        ),
        option.bool("63163", "Iara's Coral", 'Mode: [select] only\nShould the bot buy "Iara\'s Coral" ?', false),
        option.bool(
            "63164",
            "Iara's Acolyte's Cape",
            "Mode: [select] only\nShould the bot buy \"Iara's Acolyte's Cape\" ?",
            false,
        ),
        option.bool("63166", "Iara's Brush", 'Mode: [select] only\nShould the bot buy "Iara\'s Brush" ?', false),
        option.bool(
            "63167",
            "Iara's Water Orb",
            'Mode: [select] only\nShould the bot buy "Iara\'s Water Orb" ?',
            false,
        ),
        option.bool(
            "63165",
            "Iara's Acolyte's Staff",
            "Mode: [select] only\nShould the bot buy \"Iara's Acolyte's Staff\" ?",
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: IaraMerge.select,
});

export default function main(): void {
    const script = new IaraMerge();
    Core.bankingBlackList.push("Keeper of the Amazon", "Iara Insignia");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
