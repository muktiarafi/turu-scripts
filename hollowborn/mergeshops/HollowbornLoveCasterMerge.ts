/*
name: Hollowborn LoveCaster Merge
description: This bot will farm the items belonging to the selected mode for the Hollowborn LoveCaster Merge [2422] in /shadowrealm
tags: hollowborn, lovecaster, merge, shadowrealm, tophat
*/
// Port of Scripts/Hollowborn/MergeShops/HollowbornLoveCasterMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { HollowSoul } from "../materials/HollowSoul";

const Adv = new CoreAdvanced();
const Daily = new CoreDailies();
const HS = new HollowSoul();

export class HollowbornLoveCasterMerge {
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
                case "NCS Gem":
                    Daily.nCSGem(quant);
                    Core.logger(
                        `${req.name} is a daily drop, you need ${quant - bot.inventory.getQuantity(req.name)} more to buy this item. Run the script again tomorrow if you don't have enough.`,
                    );
                    break;
                case "Hollow Soul":
                    HS.getYaSoulsHeeeere(quant);
                    break;
                case "Love Potion":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9643);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("sewerpink", "Sewer1", "Left", "*", undefined, undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("shadowrealm", 2422, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "84893",
            "Hollowborn LoveCaster",
            'Mode: [select] only\nShould the bot buy "Hollowborn LoveCaster" ?',
            false,
        ),
        option.bool(
            "84894",
            "Hollowborn LoveCaster TopHat",
            'Mode: [select] only\nShould the bot buy "Hollowborn LoveCaster TopHat" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HollowbornLoveCasterMerge.select,
});

export default function main(): void {
    const script = new HollowbornLoveCasterMerge();
    Core.bankingBlackList.push("NCS Gem", "Hollow Soul", "Love Potion");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
