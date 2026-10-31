/*
name: DruidMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/DruidMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DruidMerge {
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
                case "Druid Fabric":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(800, 801);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("arcangrove", "Gorillaphant", "Gorillaphant Tusk", 6);
                        Core.huntMonster("arcangrove", "Seed Spitter", "Spool of Arcane Thread", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("arcangrove", 2003, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "60882",
            "Druid of the Lake",
            'Mode: [select] only\nShould the bot buy "Druid of the Lake" ?',
            false,
        ),
        option.bool(
            "60883",
            "Lake Druid's Locks",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Locks" ?',
            false,
        ),
        option.bool(
            "60884",
            "Lake Druid's Hair",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Hair" ?',
            false,
        ),
        option.bool(
            "60885",
            "Lake Druid's Locks + Lily",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Locks + Lily" ?',
            false,
        ),
        option.bool(
            "60886",
            "Lake Druid's Hair + Lily",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Hair + Lily" ?',
            false,
        ),
        option.bool(
            "60887",
            "Lake Druid's Flora + Fauna Cape",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Flora + Fauna Cape" ?',
            false,
        ),
        option.bool(
            "60888",
            "Lake Druid's Fauna Cape",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Fauna Cape" ?',
            false,
        ),
        option.bool(
            "60889",
            "Lake Druid's Flora Cape",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Flora Cape" ?',
            false,
        ),
        option.bool(
            "60890",
            "Lake Druid's Harp",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Harp" ?',
            false,
        ),
        option.bool(
            "60891",
            "Lake Druid's Lamp",
            'Mode: [select] only\nShould the bot buy "Lake Druid\'s Lamp" ?',
            false,
        ),
        option.bool(
            "60900",
            "Druid of the Grove",
            'Mode: [select] only\nShould the bot buy "Druid of the Grove" ?',
            false,
        ),
        option.bool(
            "60901",
            "Grove Druid's Locks + Crown",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Locks + Crown" ?',
            false,
        ),
        option.bool(
            "60902",
            "Grove Druid's Hair + Crown",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Hair + Crown" ?',
            false,
        ),
        option.bool(
            "60903",
            "Grove Druid's Horned Locks",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Horned Locks" ?',
            false,
        ),
        option.bool(
            "60904",
            "Grove Druid's Horned Hair",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Horned Hair" ?',
            false,
        ),
        option.bool(
            "60905",
            "Grove Druid's Locks",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Locks" ?',
            false,
        ),
        option.bool(
            "60906",
            "Grove Druid's Hair",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Hair" ?',
            false,
        ),
        option.bool(
            "60907",
            "Grove Druid's Horns + Fauna Cape",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Horns + Fauna Cape" ?',
            false,
        ),
        option.bool(
            "60908",
            "Grove Druid's Fauna Cape",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Fauna Cape" ?',
            false,
        ),
        option.bool(
            "60909",
            "Grove Druid's Horns Cape",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Horns Cape" ?',
            false,
        ),
        option.bool(
            "60910",
            "Grove Druid's Dagger",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Dagger" ?',
            false,
        ),
        option.bool(
            "60911",
            "Grove Druid's Staff",
            'Mode: [select] only\nShould the bot buy "Grove Druid\'s Staff" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DruidMerge.select,
});

export default function main(): void {
    const script = new DruidMerge();
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
