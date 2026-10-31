/*
name: Fabyos Spooky Merge
description: This bot will farm the items belonging to the selected mode for the Fabyos Spooky Merge [2135] in /oddities
tags: fabyos, spooky, merge, oddities, goth, pirate, musician, tophat, , beard, unicorn, commander, commanders, gothic, decorator, decorators, bloodmoon, musicians, peculiar, nail
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/FabyosSpookyMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "../story/CoreFriday13th";

const F13 = new CoreFriday13th();
const Adv = new CoreAdvanced();

export class FabyosSpookyMerge {
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
                case "Spooky Fabric Scrap":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8676);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("oddities", "r3", "Left", "*", "Cursed Cloth Roll", 13, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Eerie Embellishment":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8677);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.killMonster("oddities", "r9", "Left", "*", "Freaky Fripperies", 13, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        F13.oddities();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("oddities", 2135, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "70191",
            "Goth Pirate Musician",
            'Mode: [select] only\nShould the bot buy "Goth Pirate Musician" ?',
            false,
        ),
        option.bool(
            "70192",
            "Goth Pirate TopHat + Beard",
            'Mode: [select] only\nShould the bot buy "Goth Pirate TopHat + Beard" ?',
            false,
        ),
        option.bool(
            "70193",
            "Goth Pirate TopHat + Locks",
            'Mode: [select] only\nShould the bot buy "Goth Pirate TopHat + Locks" ?',
            false,
        ),
        option.bool(
            "70194",
            "Unicorn Commander Musician",
            'Mode: [select] only\nShould the bot buy "Unicorn Commander Musician" ?',
            false,
        ),
        option.bool(
            "70195",
            "Unicorn Commander's TopHat",
            'Mode: [select] only\nShould the bot buy "Unicorn Commander\'s TopHat" ?',
            false,
        ),
        option.bool(
            "70196",
            "Unicorn Commander's TopHat + Locks",
            'Mode: [select] only\nShould the bot buy "Unicorn Commander\'s TopHat + Locks" ?',
            false,
        ),
        option.bool("70197", "Gothic Decorator", 'Mode: [select] only\nShould the bot buy "Gothic Decorator" ?', false),
        option.bool(
            "70198",
            "Gothic Decorator's Beard",
            'Mode: [select] only\nShould the bot buy "Gothic Decorator\'s Beard" ?',
            false,
        ),
        option.bool(
            "70199",
            "Gothic Decorator's Hair",
            'Mode: [select] only\nShould the bot buy "Gothic Decorator\'s Hair" ?',
            false,
        ),
        option.bool(
            "70200",
            "Bloodmoon Musician",
            'Mode: [select] only\nShould the bot buy "Bloodmoon Musician" ?',
            false,
        ),
        option.bool(
            "70201",
            "Gothic Musician's Beard",
            'Mode: [select] only\nShould the bot buy "Gothic Musician\'s Beard" ?',
            false,
        ),
        option.bool(
            "13047",
            "Peculiar... Nail?",
            'Mode: [select] only\nShould the bot buy "Peculiar... Nail?" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: FabyosSpookyMerge.select,
});

export default function main(): void {
    const script = new FabyosSpookyMerge();
    Core.bankingBlackList.push("Spooky Fabric Scrap", "Eerie Embellishment");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
