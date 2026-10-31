/*
name: Winter Horror War Rewards Merge
description: This will get all or selected items on this merge shop.
tags: winter-horror-war-rewards-merge, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/WinterHorrorWarRewardsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const FV = new CoreFrostvale();

export class WinterHorrorWarRewardsMerge {
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
                case "Grief Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7856, 7857);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("winterhorror", "Chillybones", "Monster Gem", 5);
                        Core.huntMonster("winterhorror", "Chillybones", "Mega Monster Gem", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        FV.howardshill();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("winterhorror", 1953, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "57917",
            "Polar Bear Hoodie",
            'Mode: [select] only\nShould the bot buy "Polar Bear Hoodie" ?',
            false,
        ),
        option.bool("57918", "Polar Bear Hood", 'Mode: [select] only\nShould the bot buy "Polar Bear Hood" ?', false),
        option.bool(
            "57919",
            "Polar Bear Hood + Locks",
            'Mode: [select] only\nShould the bot buy "Polar Bear Hood + Locks" ?',
            false,
        ),
        option.bool(
            "58116",
            "Enchanted Hoodie Outfit",
            'Mode: [select] only\nShould the bot buy "Enchanted Hoodie Outfit" ?',
            false,
        ),
        option.bool(
            "58117",
            "Enchanted Hood + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Hood + Locks" ?',
            false,
        ),
        option.bool("58118", "Enchanted Hood", 'Mode: [select] only\nShould the bot buy "Enchanted Hood" ?', false),
        option.bool(
            "58119",
            "Enchanted Winter Hat + Locks",
            'Mode: [select] only\nShould the bot buy "Enchanted Winter Hat + Locks" ?',
            false,
        ),
        option.bool(
            "58120",
            "Enchanted Winter Hat",
            'Mode: [select] only\nShould the bot buy "Enchanted Winter Hat" ?',
            false,
        ),
        option.bool(
            "58549",
            "Icy Frostlorn Scythe",
            'Mode: [select] only\nShould the bot buy "Icy Frostlorn Scythe" ?',
            false,
        ),
        option.bool(
            "58545",
            "Icy Frostlorn Axe",
            'Mode: [select] only\nShould the bot buy "Icy Frostlorn Axe" ?',
            false,
        ),
        option.bool(
            "58547",
            "Icy Frostlorn Sickle",
            'Mode: [select] only\nShould the bot buy "Icy Frostlorn Sickle" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: WinterHorrorWarRewardsMerge.select,
});

export default function main(): void {
    const script = new WinterHorrorWarRewardsMerge();
    Core.bankingBlackList.push("Grief Medal");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
