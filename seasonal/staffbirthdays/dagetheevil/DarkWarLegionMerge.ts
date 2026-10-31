/*
name: (Dark War Legion) Dark War Legion Merge
description: This will complete the Dark War Legion story and farm Dark War Legion Medals.
tags: story, quest, legion, dark, war, merge, staff, birthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/DarkWarLegionMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DarkWarLegionMerge {
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
                case "Legion Defender Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8584, 8585);
                    Core.killMonster("darkwarlegion", "r2", "Left", "Bloodfiend", req.name, quant, {
                        isTemp: req.temp,
                    });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion War Banner":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8587);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("darkwarlegion", "Manslayer Fiend", "ManSlayer Slain", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Legion Trophy":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8586);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("darkwarlegion", "Dreadfiend", "Nation's Dread", 5, {
                            isTemp: false,
                            log: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Soiled Fiend Crystal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(8588);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("darkwarlegion", "Dirtlicker", "Dirtlicker Defeated");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        if (!Core.isSeasonalMapActive("darkwarlegion")) {
            return;
        }

        Adv.startBuyAllMerge("darkwarlegion", 2122, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "68984",
            "Soulfire Blademaster",
            'Mode: [select] only\nShould the bot buy "Soulfire Blademaster" ?',
            false,
        ),
        option.bool("68991", "Soulfire Mask", 'Mode: [select] only\nShould the bot buy "Soulfire Mask" ?', false),
        option.bool(
            "68992",
            "Soulfire Mask + Ponytail",
            'Mode: [select] only\nShould the bot buy "Soulfire Mask + Ponytail" ?',
            false,
        ),
        option.bool("68993", "Soulfire Armet", 'Mode: [select] only\nShould the bot buy "Soulfire Armet" ?', false),
        option.bool(
            "68995",
            "Soulfire Armet + Scarf",
            'Mode: [select] only\nShould the bot buy "Soulfire Armet + Scarf" ?',
            false,
        ),
        option.bool("69003", "Soulfire Odachi", 'Mode: [select] only\nShould the bot buy "Soulfire Odachi" ?', false),
        option.bool("69008", "Soulfire Tonfa", 'Mode: [select] only\nShould the bot buy "Soulfire Tonfa" ?', false),
        option.bool("69004", "Soulfire Odachis", 'Mode: [select] only\nShould the bot buy "Soulfire Odachis" ?', false),
        option.bool("69009", "Soulfire Tonfas", 'Mode: [select] only\nShould the bot buy "Soulfire Tonfas" ?', false),
        option.bool(
            "68985",
            "Soulfire Warmonger",
            'Mode: [select] only\nShould the bot buy "Soulfire Warmonger" ?',
            false,
        ),
        option.bool(
            "68986",
            "Flaming Soulfire Warmonger",
            'Mode: [select] only\nShould the bot buy "Flaming Soulfire Warmonger" ?',
            false,
        ),
        option.bool(
            "68994",
            "Horned Soulfire Armet",
            'Mode: [select] only\nShould the bot buy "Horned Soulfire Armet" ?',
            false,
        ),
        option.bool(
            "68996",
            "Horned Soulfire Armet + Scarf",
            'Mode: [select] only\nShould the bot buy "Horned Soulfire Armet + Scarf" ?',
            false,
        ),
        option.bool("69000", "Soulfire Cloak", 'Mode: [select] only\nShould the bot buy "Soulfire Cloak" ?', false),
        option.bool(
            "69001",
            "Flaming Soulfire Cloak",
            'Mode: [select] only\nShould the bot buy "Flaming Soulfire Cloak" ?',
            false,
        ),
        option.bool(
            "68763",
            "Dirk of the Underworld",
            'Mode: [select] only\nShould the bot buy "Dirk of the Underworld" ?',
            false,
        ),
        option.bool(
            "68764",
            "Daggers of the Underworld",
            'Mode: [select] only\nShould the bot buy "Daggers of the Underworld" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DarkWarLegionMerge.select,
});

export default function main(): void {
    const script = new DarkWarLegionMerge();
    Core.bankingBlackList.push("Legion Defender Medal", "Legion War Banner", "Legion Trophy ");
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
