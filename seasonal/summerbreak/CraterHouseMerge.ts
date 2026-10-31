/*
name: Crater House Merge
description: This bot will farm the items belonging to the selected mode for the Crater House Merge [2301] in /uppercity
tags: crater, house, merge, uppercity, big
*/
// Port of Scripts/Seasonal/SummerBreak/CraterHouseMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CraterHouseMerge {
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
                case "Inscribed Skull":
                    Core.farmingLogger(req.name, quant);
                    Core.getMapItem(11839, undefined, "deathpits");
                    break;
                case "Cursed Pirate Note":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("shipwreck", "Cursed Pirate", req.name, quant, { isTemp: req.temp, log: false });
                    break;
            }
        };
        if (!Core.isSeasonalMapActive("summerbreak")) {
            Core.logger("This merge shop is seasonal and is not currently active.");
            return;
        }
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("uppercity", 2301, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("70602", "Big Crater", 'Mode: [select] only\nShould the bot buy "Big Crater" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CraterHouseMerge.select,
});

export default function main(): void {
    const script = new CraterHouseMerge();
    Core.bankingBlackList.push("Inscribed Skull", "Cursed Pirate Note");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
