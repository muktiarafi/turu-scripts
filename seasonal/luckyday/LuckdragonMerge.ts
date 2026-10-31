/*
name: LuckyDragonMerge
description: null
tags: null
*/
// Port of Scripts/Seasonal/LuckyDay/LuckdragonMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LuckdragonMerge {
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
                case "Golden Coupon":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonsterMapID("luckdragon", 2, req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("luckdragon")) {
            return;
        }

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("luckdragon", 1233, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("38875", "Lucky Looter", 'Mode: [select] only\nShould the bot buy "Lucky Looter" ?', false),
        option.bool(
            "38876",
            "Sneaky Lucky Looter Hair",
            'Mode: [select] only\nShould the bot buy "Sneaky Lucky Looter Hair" ?',
            false,
        ),
        option.bool(
            "38877",
            "Sneaky Lucky Looter Locks",
            'Mode: [select] only\nShould the bot buy "Sneaky Lucky Looter Locks" ?',
            false,
        ),
        option.bool("38878", "Lucky Boy Hair", 'Mode: [select] only\nShould the bot buy "Lucky Boy Hair" ?', false),
        option.bool("38879", "Lucky Girl Locks", 'Mode: [select] only\nShould the bot buy "Lucky Girl Locks" ?', false),
        option.bool("38880", "Gold Sack", 'Mode: [select] only\nShould the bot buy "Gold Sack" ?', false),
        option.bool(
            "38881",
            "Gold Sack on your Back",
            'Mode: [select] only\nShould the bot buy "Gold Sack on your Back" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LuckdragonMerge.select,
});

export default function main(): void {
    const script = new LuckdragonMerge();
    Core.bankingBlackList.push("Golden Coupon");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
