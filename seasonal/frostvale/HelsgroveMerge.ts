/*
name: Helsgrove Merge
description: This will get all or selected items on this merge shop.
tags: helsgrove-merge, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/HelsgroveMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HelsgroveMerge {
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
                case "Golden Branch":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8420);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("helsgrove", "Krimpler", "Gilded Branch", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Hazel Switch":

                case "Frostval Treat":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8421);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("helsgrove", "Belsnickling", "Belsnickling Beaten", 6);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Chibi GroveRider's Locks + Bridle":

                case "Chibi GroveRider's Locks":

                case "Helsgrove Guardian Scarf":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("helsgrove", "Helsdottir", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("helsgrove", 2076, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "66052",
            "Helsgrove Guardian",
            'Mode: [select] only\nShould the bot buy "Helsgrove Guardian" ?',
            false,
        ),
        option.bool(
            "66055",
            "Helsgrove Guardian Colorful Scarf",
            'Mode: [select] only\nShould the bot buy "Helsgrove Guardian Colorful Scarf" ?',
            false,
        ),
        option.bool(
            "66056",
            "Helsgrove Guardian Antlers + Scarf",
            'Mode: [select] only\nShould the bot buy "Helsgrove Guardian Antlers + Scarf" ?',
            false,
        ),
        option.bool(
            "66057",
            "Helsgrove Guardian Colorful Antlers + Scarf",
            'Mode: [select] only\nShould the bot buy "Helsgrove Guardian Colorful Antlers + Scarf" ?',
            false,
        ),
        option.bool(
            "66062",
            "Chibi GroveRider's Accessories",
            'Mode: [select] only\nShould the bot buy "Chibi GroveRider\'s Accessories" ?',
            false,
        ),
        option.bool(
            "66063",
            "Chibi GroveRider's Accessories + Bridle",
            'Mode: [select] only\nShould the bot buy "Chibi GroveRider\'s Accessories + Bridle" ?',
            false,
        ),
        option.bool(
            "66065",
            "Helsgrove Guardian Baton",
            'Mode: [select] only\nShould the bot buy "Helsgrove Guardian Baton" ?',
            false,
        ),
        option.bool(
            "66066",
            "Helsgrove Guardian Dual Batons",
            'Mode: [select] only\nShould the bot buy "Helsgrove Guardian Dual Batons" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HelsgroveMerge.select,
});

export default function main(): void {
    const script = new HelsgroveMerge();
    Core.bankingBlackList.push(
        "Golden Branch",
        "Frostval Treat",
        "Hazel Switch",
        "Helsgrove Guardian Scarf",
        "Chibi GroveRider's Locks",
        "Chibi GroveRider's Locks + Bridle ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
