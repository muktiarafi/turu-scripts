/*
name: Crownsreach50ChestMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/Crownsreach50ChestMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { ShadowflameWarMedal } from "../ShadowflameWarMedal";

const Adv = new CoreAdvanced();
const SWM = new ShadowflameWarMedal();

export class Crownsreach50ChestMerge {
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
                case "ShadowFlame Battle Spear":

                case "ShadowFlame Battle Staff":
                    Core.farmingLogger(req.name, quant);
                    SWM.medals(100);
                    Adv.buyItem("chaosamulet", 1914, req.name);
                    break;
                case "ShadowFlame War Medal":
                    Core.farmingLogger(req.name, quant);
                    SWM.medals(quant);
                    break;
                case "ShadowFlame Broadsword":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("chaosamulet", "Goldun", req.name, quant);
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("chaosamulet", 1915, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "54260",
            "Enchanted Shadow Battle Staff",
            'Mode: [select] only\nShould the bot buy "Enchanted Shadow Battle Staff" ?',
            false,
        ),
        option.bool(
            "54262",
            "Enchanted Shadow Battle Spear",
            'Mode: [select] only\nShould the bot buy "Enchanted Shadow Battle Spear" ?',
            false,
        ),
        option.bool(
            "54268",
            "Enchanted ShadowFlame Broadsword",
            'Mode: [select] only\nShould the bot buy "Enchanted ShadowFlame Broadsword" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: Crownsreach50ChestMerge.select,
});

export default function main(): void {
    const script = new Crownsreach50ChestMerge();
    Core.bankingBlackList.push(
        "ShadowFlame Battle Staff",
        "ShadowFlame War Medal",
        "ShadowFlame Battle Spear",
        "ShadowFlame Broadsword ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
