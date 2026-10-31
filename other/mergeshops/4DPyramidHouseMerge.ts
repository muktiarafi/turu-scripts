/*
name: 4DPyramidHouseMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/4DPyramidHouseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const TOD = new CoreToD();

export class FourDPyramidHouseShop {
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
                case "Anti-Matter Gem":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5188);
                    // Reflections of Victory 5188
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("whitehole", "Dimensional Crystal", "Crystal Shards", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        TOD.fourthDimensionalPyramid();
        Farm.eternalREP();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("fourdpyramid", 1276, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("35646", "4D Pyramid House", 'Mode: [select] only\nShould the bot buy "4D Pyramid House" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FourDPyramidHouseShop.select,
});

export default function main(): void {
    const script = new FourDPyramidHouseShop();
    Core.bankingBlackList.push("Anti-Matter Gem ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
