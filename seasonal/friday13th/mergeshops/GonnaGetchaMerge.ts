/*
name: Gonna Getcha Merge
description: This will get all or selected items on this merge shop.
tags: gonna-getcha-merge, friday-the-13th, seasonal
*/
// Port of Scripts/Seasonal/Friday13th/MergeShops/GonnaGetchaMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreFriday13th } from "../story/CoreFriday13th";

const Adv = new CoreAdvanced();
const F13 = new CoreFriday13th();

export class GonnaGetchaMerge {
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
                case "GetchaDolla":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6269);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("gonnagetcha", "Vengeful Ghost", "Ghost Gone", 2, { log: false });
                        Core.huntMonster("gonnagetcha", "Shrade Cultist", "Cultist Cleared", 6, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        F13.gonnagetcha();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("gonnagetcha", 1581, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("43346", "BoneSaw Judge", 'Mode: [select] only\nShould the bot buy "BoneSaw Judge" ?', false),
        option.bool(
            "43348",
            "Hood of Judgement",
            'Mode: [select] only\nShould the bot buy "Hood of Judgement" ?',
            false,
        ),
        option.bool("43351", "BoneSaw's Saw", 'Mode: [select] only\nShould the bot buy "BoneSaw\'s Saw" ?', false),
        option.bool("43347", "BoneSaw's Stare", 'Mode: [select] only\nShould the bot buy "BoneSaw\'s Stare" ?', false),
        option.bool("43352", "Bobby The Puppet", 'Mode: [select] only\nShould the bot buy "Bobby The Puppet" ?', false),
        option.bool("43349", "Bobby's Head", 'Mode: [select] only\nShould the bot buy "Bobby\'s Head" ?', false),
        option.bool("43350", "Bobby's Hair", 'Mode: [select] only\nShould the bot buy "Bobby\'s Hair" ?', false),
        option.bool("43356", "Bobby's Bike", 'Mode: [select] only\nShould the bot buy "Bobby\'s Bike" ?', false),
        option.bool(
            "43354",
            "Bobby on the Back",
            'Mode: [select] only\nShould the bot buy "Bobby on the Back" ?',
            false,
        ),
        option.bool(
            "43358",
            "Black Knight Flag",
            'Mode: [select] only\nShould the bot buy "Black Knight Flag" ?',
            false,
        ),
        option.bool("43357", "Dark Makai Flag", 'Mode: [select] only\nShould the bot buy "Dark Makai Flag" ?', false),
        option.bool("43355", "Bobby On Bike", 'Mode: [select] only\nShould the bot buy "Bobby On Bike" ?', false),
        option.bool(
            "43353",
            "Bobby's Trike Mace",
            'Mode: [select] only\nShould the bot buy "Bobby\'s Trike Mace" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: GonnaGetchaMerge.select,
});

export default function main(): void {
    const script = new GonnaGetchaMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
