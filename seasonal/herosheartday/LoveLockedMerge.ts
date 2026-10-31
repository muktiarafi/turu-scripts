/*
name: Love Locked Merge
description: This script farms the items from Love Locked Merge Shop.
tags: seasonal, love, merge, love locked merge, heros heart day
*/
// Port of Scripts/Seasonal/HerosHeartDay/LoveLockedMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LoveLockedMerge {
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
                case "Love Token":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(4814);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("lovelockdown", "Sweeter Fish", "Sweeter Fish Swished", 6, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("lovelockdown", 1217, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("38455", "TwillyBall", 'Mode: [select] only\nShould the bot buy "TwillyBall" ?', false),
        option.bool("38457", "Book Swarm Pet", 'Mode: [select] only\nShould the bot buy "Book Swarm Pet" ?', false),
        option.bool("38453", "Love Harvester", 'Mode: [select] only\nShould the bot buy "Love Harvester" ?', false),
        option.bool("38459", "Pa-Love-Din", 'Mode: [select] only\nShould the bot buy "Pa-Love-Din" ?', false),
        option.bool("38460", "Pa-Love-Din Helm", 'Mode: [select] only\nShould the bot buy "Pa-Love-Din Helm" ?', false),
        option.bool(
            "38468",
            "Gilded Hourglass of Love",
            'Mode: [select] only\nShould the bot buy "Gilded Hourglass of Love" ?',
            false,
        ),
        option.bool("38456", "TwigBall", 'Mode: [select] only\nShould the bot buy "TwigBall" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: LoveLockedMerge.select,
});

export default function main(): void {
    const script = new LoveLockedMerge();
    Core.bankingBlackList.push("Love Token");
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
