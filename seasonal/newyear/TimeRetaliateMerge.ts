/*
name: Time Retaliate Merge
description: This will complete the Time Retaliate story and farm Time Retaliate.
tags: story, quest, time, retaliate, merge, seasonal, new-year
*/
// Port of Scripts/Seasonal/NewYear/TimeRetaliateMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class TimeRetaliateMerge {
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
                case "ChronoSand":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9033);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("timeretaliate", `Min’et’s Corpse`, "Min'et Death Mask");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "StasisGlass":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(9034);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("timeretaliate", "Retrograde Maw", "Maw's Flesh");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Gold Voucher 25k":
                    Farm.voucher(req.name, req.quantity);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("timeretaliate", 2204, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "74950",
            "Nascent ChronoWeaver",
            'Mode: [select] only\nShould the bot buy "Nascent ChronoWeaver" ?',
            false,
        ),
        option.bool(
            "74951",
            "Nascent ChronoWeaver's Helm",
            'Mode: [select] only\nShould the bot buy "Nascent ChronoWeaver\'s Helm" ?',
            false,
        ),
        option.bool(
            "74953",
            "Nascent ChronoWeaver's Halo",
            'Mode: [select] only\nShould the bot buy "Nascent ChronoWeaver\'s Halo" ?',
            false,
        ),
        option.bool(
            "74957",
            "Nascent ChronoWeaver's Gauntlet",
            'Mode: [select] only\nShould the bot buy "Nascent ChronoWeaver\'s Gauntlet" ?',
            false,
        ),
        option.bool("74958", "Astromancer", 'Mode: [select] only\nShould the bot buy "Astromancer" ?', false),
        option.bool(
            "74963",
            "Astromancer's Morph",
            'Mode: [select] only\nShould the bot buy "Astromancer\'s Morph" ?',
            false,
        ),
        option.bool(
            "74964",
            "Astromancer's Morph + Locks",
            'Mode: [select] only\nShould the bot buy "Astromancer\'s Morph + Locks" ?',
            false,
        ),
        option.bool(
            "74968",
            "Astral Navigation Staff",
            'Mode: [select] only\nShould the bot buy "Astral Navigation Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: TimeRetaliateMerge.select,
});

export default function main(): void {
    const script = new TimeRetaliateMerge();
    Core.bankingBlackList.push("ChronoSand", "StasisGlass", "Gold Voucher 25k");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
