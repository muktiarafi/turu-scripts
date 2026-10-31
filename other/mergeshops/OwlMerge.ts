/*
name: Owl Merge
description: This bot will farm the items belonging to the selected mode for the Owl Merge [1180] in /rivensylth
tags: owl, merge, rivensylth, wise, suit, wings
*/
// Port of Scripts/Other/MergeShops/OwlMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { BrightOak } from "../../story/queenofmonsters/extra/BrightOak";

const Adv = new CoreAdvanced();
const BO = new BrightOak();

export class OwlMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Stories of the Forest":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(4645);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("rivensylth", "Rivensylth Spider", req.name, quant, {
                            isTemp: true,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        BO.ælfred();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("rivensylth", 1180, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("32064", "Wise Owl Suit", 'Mode: [select] only\nShould the bot buy "Wise Owl Suit" ?', false),
        option.bool("32067", "Wise Owl Wings", 'Mode: [select] only\nShould the bot buy "Wise Owl Wings" ?', false),
        option.bool("32070", "Wise Owl Mask", 'Mode: [select] only\nShould the bot buy "Wise Owl Mask" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: OwlMerge.select,
});

export default function main(): void {
    const script = new OwlMerge();
    Core.bankingBlackList.push("Stories of the Forest");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
