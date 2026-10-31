/*
name: Snowview Merge
description: This will get all or selected items on this merge shop.
tags: snowview-merge, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/SnowviewMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const Frostvale = new CoreFrostvale();

export class SnowviewMerge {
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
                case "Fire Starting Kit":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(9016);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("snowview", "Vaderix", "Alien Mandible", undefined, { log: false });
                        Core.huntMonster("snowview", "Tundra Steed", "Horse Hair", 7, { log: false });
                        Core.huntMonster("snowview", "Mountain Owl", "Tinder Feathers", 7, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        Frostvale.snowview();

        //Only edit the map and shopID here
        Adv.startBuyAllMerge("snowview", 2195, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "74595",
            "Festive Sled Racer",
            'Mode: [select] only\nShould the bot buy "Festive Sled Racer" ?',
            false,
        ),
        option.bool(
            "74596",
            "Festive Sled Racer Hat",
            'Mode: [select] only\nShould the bot buy "Festive Sled Racer Hat" ?',
            false,
        ),
        option.bool(
            "74597",
            "Festive Sled Racer Champion Crown",
            'Mode: [select] only\nShould the bot buy "Festive Sled Racer Champion Crown" ?',
            false,
        ),
        option.bool(
            "74598",
            "Festive Sled Racer Locks and Hat",
            'Mode: [select] only\nShould the bot buy "Festive Sled Racer Locks and Hat" ?',
            false,
        ),
        option.bool(
            "74599",
            "Festive Sled Racer Locks and Crown",
            'Mode: [select] only\nShould the bot buy "Festive Sled Racer Locks and Crown" ?',
            false,
        ),
        option.bool(
            "74600",
            "Festive Enamel Snowflakes",
            'Mode: [select] only\nShould the bot buy "Festive Enamel Snowflakes" ?',
            false,
        ),
        option.bool(
            "74602",
            "Festive Sled Racer Cape",
            'Mode: [select] only\nShould the bot buy "Festive Sled Racer Cape" ?',
            false,
        ),
        option.bool(
            "74603",
            "Festive Sled Racer Cape and Enamel Snowflakes",
            'Mode: [select] only\nShould the bot buy "Festive Sled Racer Cape and Enamel Snowflakes" ?',
            false,
        ),
        option.bool(
            "74604",
            "Golden Snowflake Sickle",
            'Mode: [select] only\nShould the bot buy "Golden Snowflake Sickle" ?',
            false,
        ),
        option.bool(
            "74605",
            "Golden Snowflake Sickles",
            'Mode: [select] only\nShould the bot buy "Golden Snowflake Sickles" ?',
            false,
        ),
        option.bool("74606", "Snowflake Sickle", 'Mode: [select] only\nShould the bot buy "Snowflake Sickle" ?', false),
        option.bool(
            "74607",
            "Snowflake Sickles",
            'Mode: [select] only\nShould the bot buy "Snowflake Sickles" ?',
            false,
        ),
        option.bool(
            "74608",
            "Festive Golden Snowflake Bow",
            'Mode: [select] only\nShould the bot buy "Festive Golden Snowflake Bow" ?',
            false,
        ),
        option.bool(
            "74609",
            "Mix n' Match Sickles",
            'Mode: [select] only\nShould the bot buy "Mix n\' Match Sickles" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: SnowviewMerge.select,
});

export default function main(): void {
    const script = new SnowviewMerge();
    Core.bankingBlackList.push("Fire Starting Kit ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
