/*
name: Wubbles Merge Shop
description: This script farms the items from Wubbles Merge Shop.
tags: seasonal, love, wubbles, merge, heros heart day
*/
// Port of Scripts/Seasonal/HerosHeartDay/WubblesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { Wubbles } from "./Wubbles";

const Adv = new CoreAdvanced();
const Wub = new Wubbles();

export class WubblesMerge {
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
                case "Wub Charm":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("wubblevania", "Charmed Alina", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Chocolate Tail":

                case "Furry Heart":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("wubblevania", "Mr. Wubbles", req.name, quant, { isTemp: false, log: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        Wub.completeStory();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("wubbles", 1691, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("46840", "Cupid of Love", 'Mode: [select] only\nShould the bot buy "Cupid of Love" ?', false),
        option.bool(
            "46841",
            "Cupid of Love Halo",
            'Mode: [select] only\nShould the bot buy "Cupid of Love Halo" ?',
            false,
        ),
        option.bool(
            "46842",
            "Cupid of Love Wings",
            'Mode: [select] only\nShould the bot buy "Cupid of Love Wings" ?',
            false,
        ),
        option.bool(
            "46843",
            "Cupid of Love Bow + Arrow",
            'Mode: [select] only\nShould the bot buy "Cupid of Love Bow + Arrow" ?',
            false,
        ),
        option.bool(
            "46844",
            "Cupid of Love Bow",
            'Mode: [select] only\nShould the bot buy "Cupid of Love Bow" ?',
            false,
        ),
        option.bool("46831", "Cupid of Gold", 'Mode: [select] only\nShould the bot buy "Cupid of Gold" ?', false),
        option.bool(
            "46832",
            "Cupid of Gold Crown",
            'Mode: [select] only\nShould the bot buy "Cupid of Gold Crown" ?',
            false,
        ),
        option.bool(
            "46833",
            "Cupid of Gold Wings",
            'Mode: [select] only\nShould the bot buy "Cupid of Gold Wings" ?',
            false,
        ),
        option.bool(
            "46834",
            "Cupid of Gold Bow",
            'Mode: [select] only\nShould the bot buy "Cupid of Gold Bow" ?',
            false,
        ),
        option.bool(
            "46845",
            "Cupid of Gold Bow + Arrow",
            'Mode: [select] only\nShould the bot buy "Cupid of Gold Bow + Arrow" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WubblesMerge.select,
});

export default function main(): void {
    const script = new WubblesMerge();
    Core.bankingBlackList.push("Wub Charm", "Furry Heart", "Chocolate Tail");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
