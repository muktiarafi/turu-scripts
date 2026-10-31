/*
name: Harvest Day Parade Merge
description: This will get all or selected items on this merge shop.
tags: harvest-day-parade-merge, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/MergeShops/HarvestDayParadeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HarvestDayParadeMerge {
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
                case "Pink Balloon Scrap":

                case "Green Balloon Scrap":

                case "Red Balloon Scrap":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("float", "Beleen Balloon", req.name, quant);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("float")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("float", 234, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("32295", "Pilgrim Warrior", 'Mode: [select] only\nShould the bot buy "Pilgrim Warrior" ?', false),
        option.bool("32296", "Pilgrim Wizard", 'Mode: [select] only\nShould the bot buy "Pilgrim Wizard" ?', false),
        option.bool(
            "32292",
            "Settler's Greatsword",
            'Mode: [select] only\nShould the bot buy "Settler\'s Greatsword" ?',
            false,
        ),
        option.bool(
            "32293",
            "Settler's Longsword",
            'Mode: [select] only\nShould the bot buy "Settler\'s Longsword" ?',
            false,
        ),
        option.bool(
            "32299",
            "Turdraken Trophy Sword",
            'Mode: [select] only\nShould the bot buy "Turdraken Trophy Sword" ?',
            false,
        ),
        option.bool(
            "32300",
            "Shield and Spear o' Plenty",
            'Mode: [select] only\nShould the bot buy "Shield and Spear o\' Plenty" ?',
            false,
        ),
        option.bool(
            "32301",
            "Turdraken Scale Sword",
            'Mode: [select] only\nShould the bot buy "Turdraken Scale Sword" ?',
            false,
        ),
        option.bool(
            "32302",
            "Fallen Leaf Sword",
            'Mode: [select] only\nShould the bot buy "Fallen Leaf Sword" ?',
            false,
        ),
        option.bool("32382", "Staff of Thanks", 'Mode: [select] only\nShould the bot buy "Staff of Thanks" ?', false),
        option.bool(
            "32297",
            "Harvest Sword and Shield",
            'Mode: [select] only\nShould the bot buy "Harvest Sword and Shield" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: HarvestDayParadeMerge.select,
});

export default function main(): void {
    const script = new HarvestDayParadeMerge();
    Core.bankingBlackList.push("Pink Balloon Scrap", "Green Balloon Scrap", "Red Balloon Scrap ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
