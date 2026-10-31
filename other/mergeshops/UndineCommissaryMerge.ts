/*
name: Undine Commissary Merge
description: This bot will farm the items belonging to the selected mode for the Undine Commissary Merge [2288] in /sunlightzone
tags: undine, commissary, merge, sunlightzone, fas, casual, ensemble, mis, doctor, defence, director, researcher, clean, bob, cut, horn, songs, high, ponytail, glasses
*/
// Port of Scripts/Other/MergeShops/UndineCommissaryMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class UndineCommissaryMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
    private dontStopMissingIng = false;

    protectRequiredItems(): void {
        const items = ["Undine Base Scrip", "Sun Zone Chit"];

        for (const item of items) {
            if (!Core.bankingBlackList.includes(item)) {
                Core.bankingBlackList.push(item);
            }
        }
    }

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
                case "Undine Base Scrip":
                    Core.farmingLogger(req.name, quant);
                    Core.huntMonster("sunlightzone", "Marine Snow", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Sun Zone Chit":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9252);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("sunlightzone", "Marine Snow", "Marine Sample", undefined, { log: false });
                        Core.huntMonster("sunlightzone", "Infernal Illusion", "Infernal Sample", 10, { log: false });
                        Core.huntMonster("sunlightzone", "Seraphic Illusion", "Seraphic Sample", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        this.protectRequiredItems();
        AOR.sunlightZone();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("sunlightzone", 2288, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "77957",
            "Fa's Casual Ensemble",
            'Mode: [select] only\nShould the bot buy "Fa\'s Casual Ensemble" ?',
            false,
        ),
        option.bool(
            "77960",
            "Mi's Casual Ensemble",
            'Mode: [select] only\nShould the bot buy "Mi\'s Casual Ensemble" ?',
            false,
        ),
        option.bool("77963", "Undine Doctor", 'Mode: [select] only\nShould the bot buy "Undine Doctor" ?', false),
        option.bool(
            "77964",
            "Undine Defence Director",
            'Mode: [select] only\nShould the bot buy "Undine Defence Director" ?',
            false,
        ),
        option.bool(
            "77965",
            "Undine Researcher",
            'Mode: [select] only\nShould the bot buy "Undine Researcher" ?',
            false,
        ),
        option.bool(
            "77958",
            "Fa's Clean Bob Cut",
            'Mode: [select] only\nShould the bot buy "Fa\'s Clean Bob Cut" ?',
            false,
        ),
        option.bool(
            "77959",
            "Fa's Clean Bob Cut Horn",
            'Mode: [select] only\nShould the bot buy "Fa\'s Clean Bob Cut Horn" ?',
            false,
        ),
        option.bool(
            "77961",
            "Song's High Ponytail Glasses",
            'Mode: [select] only\nShould the bot buy "Song\'s High Ponytail Glasses" ?',
            false,
        ),
        option.bool(
            "77962",
            "Song's High Ponytail",
            'Mode: [select] only\nShould the bot buy "Song\'s High Ponytail" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: UndineCommissaryMerge.select,
});

export default function main(): void {
    const script = new UndineCommissaryMerge();
    script.protectRequiredItems();
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
