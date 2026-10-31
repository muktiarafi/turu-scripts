/*
name: Lord Granvilles Merge
description: This bot will farm the items belonging to the selected mode for the Lord Granvilles Merge [2442] in /balemorale
tags: lord, granvilles, merge, balemorale, gold, voucher, k, defender, defenders, sheathed, noble
*/
// Port of Scripts/Other/MergeShops/LordGranvillesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LordGranvillesMerge {
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
                case "Balemorale Crest":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.killMonster("balemorale", "r2", "Left", "*", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("balemorale", 2442, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "20702",
            "Defender Of Balemorale",
            'Mode: [select] only\nShould the bot buy "Defender Of Balemorale" ?',
            false,
        ),
        option.bool(
            "20703",
            "Defender Of Balemorale Helm",
            'Mode: [select] only\nShould the bot buy "Defender Of Balemorale Helm" ?',
            false,
        ),
        option.bool(
            "20704",
            "Defenders of Balemorale Spikes",
            'Mode: [select] only\nShould the bot buy "Defenders of Balemorale Spikes" ?',
            false,
        ),
        option.bool(
            "20705",
            "Sheathed Balemorale Defender Blades",
            'Mode: [select] only\nShould the bot buy "Sheathed Balemorale Defender Blades" ?',
            false,
        ),
        option.bool(
            "20706",
            "Noble Defender Of Balemorale Blade",
            'Mode: [select] only\nShould the bot buy "Noble Defender Of Balemorale Blade" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LordGranvillesMerge.select,
});

export default function main(): void {
    const script = new LordGranvillesMerge();
    Core.bankingBlackList.push("Balemorale Crest");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
