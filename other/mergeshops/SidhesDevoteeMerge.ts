/*
name: Sidhes Devotee Merge
description: This bot will farm the items belonging to the selected mode for the Sidhes Devotee Merge [2447] in /castleeblana
tags: sidhes, devotee, merge, castleeblana, wrap, ensnared, devotees, goblet, mugs, brigand, bandana, misty, faes, moon, pistol, pistols, leanan, minions
*/
// Port of Scripts/Other/MergeShops/SidhesDevoteeMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Adv = new CoreAdvanced();
const AOR = new CoreAOR();

export class SidhesDevoteeMerge {
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
                case "Sidhe's Silk":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9746);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("castleeblana", "Leanan Sidhe", "Glassy Wings", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Leanan Sidhe's Butterflies":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("castleeblana", "Leanan Sidhe", req.name, quant, { isTemp: false, log: false });
                    break;
            }
        };
        AOR.castleeblana();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("castleeblana", 2447, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("73755", "Sidhe's Devotee", 'Mode: [select] only\nShould the bot buy "Sidhe\'s Devotee" ?', false),
        option.bool(
            "73756",
            "Sidhe's Devotee Hair",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Devotee Hair" ?',
            false,
        ),
        option.bool(
            "73757",
            "Sidhe's Devotee Locks",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Devotee Locks" ?',
            false,
        ),
        option.bool(
            "73758",
            "Sidhe's Devotee Wrap",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Devotee Wrap" ?',
            false,
        ),
        option.bool(
            "73759",
            "Sidhe's Devotee Daggers",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Devotee Daggers" ?',
            false,
        ),
        option.bool(
            "86218",
            "Sidhe's Devotee Dagger",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Devotee Dagger" ?',
            false,
        ),
        option.bool(
            "71315",
            "Ensnared Devotee's Goblet",
            'Mode: [select] only\nShould the bot buy "Ensnared Devotee\'s Goblet" ?',
            false,
        ),
        option.bool(
            "71316",
            "Ensnared Devotee's Mugs",
            'Mode: [select] only\nShould the bot buy "Ensnared Devotee\'s Mugs" ?',
            false,
        ),
        option.bool(
            "71320",
            "Sidhe's Brigand Devotee",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Brigand Devotee" ?',
            false,
        ),
        option.bool(
            "71322",
            "Sidhe's Brigand Bandana",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Brigand Bandana" ?',
            false,
        ),
        option.bool(
            "71324",
            "Misty Fae's Moon",
            'Mode: [select] only\nShould the bot buy "Misty Fae\'s Moon" ?',
            false,
        ),
        option.bool(
            "71327",
            "Sidhe's Brigand Pistol",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Brigand Pistol" ?',
            false,
        ),
        option.bool(
            "71328",
            "Sidhe's Brigand Pistols",
            'Mode: [select] only\nShould the bot buy "Sidhe\'s Brigand Pistols" ?',
            false,
        ),
        option.bool(
            "86221",
            "Leanan Sidhe's Minions",
            'Mode: [select] only\nShould the bot buy "Leanan Sidhe\'s Minions" ?',
            false,
        ),
        option.bool(
            "86171",
            "Leanan Sidhe's Aura",
            'Mode: [select] only\nShould the bot buy "Leanan Sidhe\'s Aura" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SidhesDevoteeMerge.select,
});

export default function main(): void {
    const script = new SidhesDevoteeMerge();
    Core.bankingBlackList.push("Sidhe's Silk", "Leanan Sidhe's Butterflies");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
