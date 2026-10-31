/*
name: Rabbit Merge
description: This bot will farm the items belonging to the selected mode for the Rabbit Merge [1178] in /rivensylth
tags: rabbit, merge, rivensylth, speedy, hare, suit, tail
*/
// Port of Scripts/Other/MergeShops/RabbitMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { BrightOak } from "../../story/queenofmonsters/extra/BrightOak";

const Adv = new CoreAdvanced();
const BO = new BrightOak();

export class RabbitMerge {
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
        Adv.startBuyAllMerge("rivensylth", 1178, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("32065", "Speedy Hare Suit", 'Mode: [select] only\nShould the bot buy "Speedy Hare Suit" ?', false),
        option.bool("32068", "Speedy Hare Tail", 'Mode: [select] only\nShould the bot buy "Speedy Hare Tail" ?', false),
        option.bool("32071", "Speedy Hare Mask", 'Mode: [select] only\nShould the bot buy "Speedy Hare Mask" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: RabbitMerge.select,
});

export default function main(): void {
    const script = new RabbitMerge();
    Core.bankingBlackList.push("Stories of the Forest");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
