/*
name: Celestial Past Merge
description: This bot will farm the items belonging to the selected mode for the Celestial Past Merge [1909] in /celestialpast
tags: celestial, past, merge, celestialpast, summoner, aranx
*/
// Port of Scripts/Other/MergeShops/CelestialPastMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CelestialPastMerge {
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
                case "Celestial Quintessence":
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("CelestialPast", "Blessed Bear", req.name, quant, { isTemp: false });
                        Core.huntMonster("CelestialPast", "Blessed Deer", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("celestialpast", 1909, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "56082",
            "Celestial Summoner",
            'Mode: [select] only\nShould the bot buy "Celestial Summoner" ?',
            false,
        ),
        option.bool(
            "56083",
            "Celestial Summoner Hair",
            'Mode: [select] only\nShould the bot buy "Celestial Summoner Hair" ?',
            false,
        ),
        option.bool(
            "56084",
            "Celestial Summoner Helm",
            'Mode: [select] only\nShould the bot buy "Celestial Summoner Helm" ?',
            false,
        ),
        option.bool(
            "56085",
            "Celestial Summoner Hood",
            'Mode: [select] only\nShould the bot buy "Celestial Summoner Hood" ?',
            false,
        ),
        option.bool(
            "56086",
            "Celestial Summoner Rune Cape",
            'Mode: [select] only\nShould the bot buy "Celestial Summoner Rune Cape" ?',
            false,
        ),
        option.bool(
            "56153",
            "Celestial Summoner Rune",
            'Mode: [select] only\nShould the bot buy "Celestial Summoner Rune" ?',
            false,
        ),
        option.bool(
            "56154",
            "Celestial Summoner Cape",
            'Mode: [select] only\nShould the bot buy "Celestial Summoner Cape" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: CelestialPastMerge.select,
});

export default function main(): void {
    const script = new CelestialPastMerge();
    Core.bankingBlackList.push("Celestial Quintessence ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
