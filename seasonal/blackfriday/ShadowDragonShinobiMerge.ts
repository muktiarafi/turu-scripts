/*
name: Shadow Dragon Shinobi Merge
description: This will get all or selected items on this merge shop.
tags: shadow-dragon-shinobi-merge, black-friday, seasonal
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowDragonShinobiMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ShadowDragonShinobiMerge {
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
                case "Dragon Shinobi Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    if (bot.quests.isAvailable(7924)) {
                        Core.registerQuests(7924);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("shadowfortress", "1st Head of Orochi", "Perfect Orochi Scales", 10, {
                                isTemp: false,
                                log: false,
                            });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    } else {
                        Core.equipClass(ClassType.Farm);
                        Core.registerQuests(7815);
                        while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                            Core.huntMonster("blackfridaywar", "Deal Bot 2.0", "EbilCorp Bots Battled", 20, {
                                log: false,
                            });
                            Core.huntMonsterMapID("blackfridaywar", 3, "EbilCorp Shoppers Saved", 20, { log: false });
                            bot.wait.forPickup(req.name);
                        }
                        Core.cancelRegisteredQuests();
                    }
                    break;
            }
        };
        //Only edit the map and shopID here
        if (!Core.isSeasonalMapActive("blackfridaywar")) {
            Core.logger("This merge shop is seasonal only.");
            return;
        }

        Adv.startBuyAllMerge("blackfridaywar", 756, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "57723",
            "Shadow Dragon Shinobi",
            'Mode: [select] only\nShould the bot buy "Shadow Dragon Shinobi" ?',
            false,
        ),
        option.bool(
            "57719",
            "Shadow Dragon Shinobi Hood",
            'Mode: [select] only\nShould the bot buy "Shadow Dragon Shinobi Hood" ?',
            false,
        ),
        option.bool(
            "57720",
            "Shadow Dragon Shinobi Guard",
            'Mode: [select] only\nShould the bot buy "Shadow Dragon Shinobi Guard" ?',
            false,
        ),
        option.bool(
            "57722",
            "Fury of the Shadow Dragon",
            'Mode: [select] only\nShould the bot buy "Fury of the Shadow Dragon" ?',
            false,
        ),
        option.bool(
            "57721",
            "Wrath of the Shadow Dragon",
            'Mode: [select] only\nShould the bot buy "Wrath of the Shadow Dragon" ?',
            false,
        ),
        option.bool(
            "57718",
            "Shadow Dragon Shinobi Armor",
            'Mode: [select] only\nShould the bot buy "Shadow Dragon Shinobi Armor" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ShadowDragonShinobiMerge.select,
});

export default function main(): void {
    const script = new ShadowDragonShinobiMerge();
    Core.bankingBlackList.push("Dragon Shinobi Token ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
