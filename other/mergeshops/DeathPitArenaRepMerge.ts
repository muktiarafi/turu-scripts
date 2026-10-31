/*
name: Death Pit Arena Rep Merge
description: This bot will farm the items belonging to the selected mode for the Death Pit Arena Rep Merge [1261] in /deathpit
tags: death, pit, arena, rep, merge, deathpit, general, galls, velms, hungars, chuds, spinal, carnage, malice, drakel, chud, velm, hungar, gall, green, morph, warlord
*/
// Port of Scripts/Other/MergeShops/DeathPitArenaRepMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class DeathPitArenaRepMerge {
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
                case "Death Pit Arena Medal":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("deathpit", "Training Dummy", req.name, quant, { isTemp: false });
                    break;
                case "General Gall Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(5147);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Battle: You vs General Gall! 5147
                        Core.huntMonster("deathpit", "General Gall", "General Gall Defeated");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "General Velm Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(5149);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //General Velm 5149
                        Core.huntMonster("deathpit", "General Velm", "General Velm Defeated");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "General Hun'Gar Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(5155);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //Do You Even Brawl 5155
                        Core.huntMonster("deathpit", "Velm's Restorer", "Death Pit Token");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "General Chud Medal":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(5151);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //General Chud 5151
                        Core.huntMonster("deathpit", "General Chud", "General Chud Defeated");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("deathpit", 1261, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "35269",
            "General Gall's Armor",
            'Mode: [select] only\nShould the bot buy "General Gall\'s Armor" ?',
            false,
        ),
        option.bool(
            "35270",
            "General Velm's Armor",
            'Mode: [select] only\nShould the bot buy "General Velm\'s Armor" ?',
            false,
        ),
        option.bool(
            "35272",
            "General Hun'Gar's Armor",
            "Mode: [select] only\nShould the bot buy \"General Hun'Gar's Armor\" ?",
            false,
        ),
        option.bool(
            "35274",
            "General Chud's Armor",
            'Mode: [select] only\nShould the bot buy "General Chud\'s Armor" ?',
            false,
        ),
        option.bool(
            "35271",
            "General Velm's Helm",
            'Mode: [select] only\nShould the bot buy "General Velm\'s Helm" ?',
            false,
        ),
        option.bool(
            "35273",
            "General Hun'Gar's Helm",
            "Mode: [select] only\nShould the bot buy \"General Hun'Gar's Helm\" ?",
            false,
        ),
        option.bool(
            "35275",
            "General Chud's Helm",
            'Mode: [select] only\nShould the bot buy "General Chud\'s Helm" ?',
            false,
        ),
        option.bool(
            "35350",
            "Spinal Carnage Staff",
            'Mode: [select] only\nShould the bot buy "Spinal Carnage Staff" ?',
            false,
        ),
        option.bool("35355", "Sword of Malice", 'Mode: [select] only\nShould the bot buy "Sword of Malice" ?', false),
        option.bool(
            "35419",
            "Drakel Chud Armor",
            'Mode: [select] only\nShould the bot buy "Drakel Chud Armor" ?',
            false,
        ),
        option.bool(
            "35417",
            "Drakel Velm Armor",
            'Mode: [select] only\nShould the bot buy "Drakel Velm Armor" ?',
            false,
        ),
        option.bool(
            "35418",
            "Drakel Hun'Gar Armor",
            'Mode: [select] only\nShould the bot buy "Drakel Hun\'Gar Armor" ?',
            false,
        ),
        option.bool(
            "35416",
            "Drakel Gall Armor (Green)",
            'Mode: [select] only\nShould the bot buy "Drakel Gall Armor (Green)" ?',
            false,
        ),
        option.bool(
            "35421",
            "Drakel Velm Helmet",
            'Mode: [select] only\nShould the bot buy "Drakel Velm Helmet" ?',
            false,
        ),
        option.bool(
            "35422",
            "Drakel Green Morph",
            'Mode: [select] only\nShould the bot buy "Drakel Green Morph" ?',
            false,
        ),
        option.bool(
            "35423",
            "Drakel Gall Armor",
            'Mode: [select] only\nShould the bot buy "Drakel Gall Armor" ?',
            false,
        ),
        option.bool(
            "35424",
            "Drakel Gall Morph",
            'Mode: [select] only\nShould the bot buy "Drakel Gall Morph" ?',
            false,
        ),
        option.bool("34946", "Drakel Chud Helm", 'Mode: [select] only\nShould the bot buy "Drakel Chud Helm" ?', false),
        option.bool("35433", "Drakel Warlord", 'Mode: [select] only\nShould the bot buy "Drakel Warlord" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: DeathPitArenaRepMerge.select,
});

export default function main(): void {
    const script = new DeathPitArenaRepMerge();
    Core.bankingBlackList.push(
        "Death Pit Arena Medal",
        "General Gall Medal",
        "General Velm Medal",
        "General Hun'Gar Medal",
        "General Chud Medal",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
