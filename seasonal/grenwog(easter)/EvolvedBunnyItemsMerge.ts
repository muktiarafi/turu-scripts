/*
name: EvolvedBunnyItemsMerge
description: Farms materials and buys the items from the EvolvedBunnyItems mergeshop
tags: grenwog, evolved, bunny, merge
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/EvolvedBunnyItemsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class EvolvedBunnyItemsMerge {
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
                case "Magical Marshmallow Cheep":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("deathgazer", "Deathgazer", req.name, quant, { isTemp: false });
                    break;
                case "Gold-foil Chocolate Bunny":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("greendragon", "Greenguard Dragon", req.name, quant, { isTemp: false });
                    break;
                case "Basketful of Dyed Eggs":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("trunk", "Greenguard Basilisk", req.name, quant, { isTemp: false });
                    break;
                case "Berserker Bunny":
                    Farm.berserkerBunny(0, false);
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("grenwog")) {
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("grenwog", 269, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "34414",
            "Evolved Bunny Berserker",
            'Mode: [select] only\nShould the bot buy "Evolved Bunny Berserker" ?',
            false,
        ),
        option.bool(
            "34411",
            "Evolved Bunny Berserker Long Sword",
            'Mode: [select] only\nShould the bot buy "Evolved Bunny Berserker Long Sword" ?',
            false,
        ),
        option.bool(
            "34412",
            "Evolved Bunny Berserker Helm",
            'Mode: [select] only\nShould the bot buy "Evolved Bunny Berserker Helm" ?',
            false,
        ),
        option.bool(
            "34413",
            "Evolved Bunny Berserker Spear",
            'Mode: [select] only\nShould the bot buy "Evolved Bunny Berserker Spear" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: EvolvedBunnyItemsMerge.select,
});

export default function main(): void {
    const script = new EvolvedBunnyItemsMerge();
    Core.bankingBlackList.push(
        "Magical Marshmallow Cheep",
        "Gold-foil Chocolate Bunny",
        "Basketful of Dyed Eggs",
        "Berserker Bunny",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
