/*
name: Bow Jangles Merge
description: This will get all or selected items on this merge shop.
tags: bow-jangles-merge, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/BowJanglesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const FV = new CoreFrostvale();

export class BowJanglesMerge {
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
                case "Gift Ribbons":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7829);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("goldenruins", "Golden Warrior", "Golden Warriors Trashed", 6);
                        Core.huntMonster("goldenruins", "Maximillian Lionfang", "Lionfang Thrown Out");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        FV.bowJangles();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("frostvale", 1946, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("57931", "GiftHunter", 'Mode: [select] only\nShould the bot buy "GiftHunter" ?', false),
        option.bool(
            "57932",
            "GiftHunter's Hat",
            'Mode: [select] only\nShould the bot buy "GiftHunter\'s Hat" ?',
            false,
        ),
        option.bool(
            "57933",
            "GiftHunter's Hat + Scarf",
            'Mode: [select] only\nShould the bot buy "GiftHunter\'s Hat + Scarf" ?',
            false,
        ),
        option.bool(
            "57934",
            "GiftHunter's Beanie",
            'Mode: [select] only\nShould the bot buy "GiftHunter\'s Beanie" ?',
            false,
        ),
        option.bool(
            "57935",
            "GiftHunter's Cape",
            'Mode: [select] only\nShould the bot buy "GiftHunter\'s Cape" ?',
            false,
        ),
        option.bool(
            "57936",
            "GiftHunter's Sack of Gifts",
            'Mode: [select] only\nShould the bot buy "GiftHunter\'s Sack of Gifts" ?',
            false,
        ),
        option.bool(
            "58038",
            "Jolly Frostval Caster",
            'Mode: [select] only\nShould the bot buy "Jolly Frostval Caster" ?',
            false,
        ),
        option.bool(
            "58041",
            "Jolly Frostval Caster's Locks",
            'Mode: [select] only\nShould the bot buy "Jolly Frostval Caster\'s Locks" ?',
            false,
        ),
        option.bool(
            "58042",
            "Jolly Frostval Caster's Hair",
            'Mode: [select] only\nShould the bot buy "Jolly Frostval Caster\'s Hair" ?',
            false,
        ),
        option.bool(
            "58043",
            "Jolly Frostval Caster's Locks + Hat",
            'Mode: [select] only\nShould the bot buy "Jolly Frostval Caster\'s Locks + Hat" ?',
            false,
        ),
        option.bool(
            "58044",
            "Jolly Frostval Caster's Hat",
            'Mode: [select] only\nShould the bot buy "Jolly Frostval Caster\'s Hat" ?',
            false,
        ),
        option.bool(
            "58046",
            "Jolly Frostval Caster's Jester Cape",
            'Mode: [select] only\nShould the bot buy "Jolly Frostval Caster\'s Jester Cape" ?',
            false,
        ),
        option.bool(
            "58047",
            "The Edge of Giving",
            'Mode: [select] only\nShould the bot buy "The Edge of Giving" ?',
            false,
        ),
        option.bool(
            "58049",
            "Jolly Frostval Caster's Sword",
            'Mode: [select] only\nShould the bot buy "Jolly Frostval Caster\'s Sword" ?',
            false,
        ),
        option.bool(
            "58152",
            "Reversed Edge of Giving",
            'Mode: [select] only\nShould the bot buy "Reversed Edge of Giving" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: BowJanglesMerge.select,
});

export default function main(): void {
    const script = new BowJanglesMerge();
    Core.bankingBlackList.push("Gift Ribbons");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
