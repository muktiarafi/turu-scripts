/*
name: Yokai Treasure Merge
description: This bot will farm the items belonging to the selected mode for the Yokai Treasure Merge [2339] in /yokaitreasure
tags: yokai, treasure, merge, yokaitreasure, tengu, admiral, daitengu, bearded, feather, cap, morph, typhoon, cutlasses, dragonslayer, commanders, pistol, pistols, boomstick, boomsticks, shinobi, pirate, master, stealthy, sea, masked, moonlit, steel, rapiers, iron, flight, doomtech, moglin, minion, battlepet
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/YokaiTreasureMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreDOY } from "../../../story/dragonsofyokai/CoreDOY";

const Adv = new CoreAdvanced();
const DOY = new CoreDOY();

export class YokaiTreasureMerge {
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
                case "Wuji Steel":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9406);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("yokaitreasure", "Admiral Zheng", "Shapeshifting Pearl", undefined, {
                            log: false,
                        });
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("yokaitreasure", "Needle Mouth", "Condemned Brand", 4, { log: false });
                        Core.huntMonster("yokaitreasure", "Imperial Warrior", "Imperial Seal", 4, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Mercury Phial":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("yokaitreasure", "Needle Mouth", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Tengu Typhoon Cutlass":

                case "Moonlit Steel Rapier":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("yokaitreasure", "Admiral Zheng", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Stealthy Sea Hair":

                case "Stealthy Sea Locks":

                case "Stealthy Sea Patch Hair":

                case "Stealthy Sea Patch Locks":

                case "Iron Flight Cutlass":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("yokaitreasure", "Imperial Warrior", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    break;
            }
        };
        DOY.yokaiTreasure();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokaitreasure", 2339, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("79818", "Tengu Admiral", 'Mode: [select] only\nShould the bot buy "Tengu Admiral" ?', false),
        option.bool("79819", "Daitengu Admiral", 'Mode: [select] only\nShould the bot buy "Daitengu Admiral" ?', false),
        option.bool(
            "79821",
            "Bearded Tengu Feather Cap",
            'Mode: [select] only\nShould the bot buy "Bearded Tengu Feather Cap" ?',
            false,
        ),
        option.bool(
            "79823",
            "Daitengu Admiral Morph",
            'Mode: [select] only\nShould the bot buy "Daitengu Admiral Morph" ?',
            false,
        ),
        option.bool(
            "79826",
            "Tengu Typhoon Cutlasses",
            'Mode: [select] only\nShould the bot buy "Tengu Typhoon Cutlasses" ?',
            false,
        ),
        option.bool(
            "79935",
            "DragonSlayer Commander's Pistol",
            'Mode: [select] only\nShould the bot buy "DragonSlayer Commander\'s Pistol" ?',
            false,
        ),
        option.bool(
            "79936",
            "DragonSlayer Commander's Pistols",
            'Mode: [select] only\nShould the bot buy "DragonSlayer Commander\'s Pistols" ?',
            false,
        ),
        option.bool(
            "79937",
            "DragonSlayer Commander's Boomstick",
            'Mode: [select] only\nShould the bot buy "DragonSlayer Commander\'s Boomstick" ?',
            false,
        ),
        option.bool(
            "79938",
            "DragonSlayer Commander's Boomsticks",
            'Mode: [select] only\nShould the bot buy "DragonSlayer Commander\'s Boomsticks" ?',
            false,
        ),
        option.bool(
            "80185",
            "Shinobi Pirate Master",
            'Mode: [select] only\nShould the bot buy "Shinobi Pirate Master" ?',
            false,
        ),
        option.bool(
            "80188",
            "Stealthy Sea Morph",
            'Mode: [select] only\nShould the bot buy "Stealthy Sea Morph" ?',
            false,
        ),
        option.bool(
            "80189",
            "Stealthy Sea Visage",
            'Mode: [select] only\nShould the bot buy "Stealthy Sea Visage" ?',
            false,
        ),
        option.bool(
            "80192",
            "Shinobi Pirate Cap Hair",
            'Mode: [select] only\nShould the bot buy "Shinobi Pirate Cap Hair" ?',
            false,
        ),
        option.bool(
            "80193",
            "Shinobi Pirate Cap Locks",
            'Mode: [select] only\nShould the bot buy "Shinobi Pirate Cap Locks" ?',
            false,
        ),
        option.bool(
            "80194",
            "Masked Shinobi Pirate Cap Hair",
            'Mode: [select] only\nShould the bot buy "Masked Shinobi Pirate Cap Hair" ?',
            false,
        ),
        option.bool(
            "80195",
            "Masked Shinobi Pirate Cap Locks",
            'Mode: [select] only\nShould the bot buy "Masked Shinobi Pirate Cap Locks" ?',
            false,
        ),
        option.bool(
            "80199",
            "Moonlit Steel Rapiers",
            'Mode: [select] only\nShould the bot buy "Moonlit Steel Rapiers" ?',
            false,
        ),
        option.bool(
            "80201",
            "Iron Flight Cutlasses",
            'Mode: [select] only\nShould the bot buy "Iron Flight Cutlasses" ?',
            false,
        ),
        option.bool(
            "79504",
            "DoomTech Moglin Minion",
            'Mode: [select] only\nShould the bot buy "DoomTech Moglin Minion" ?',
            false,
        ),
        option.bool(
            "79505",
            "DoomTech Moglin Minion BattlePet",
            'Mode: [select] only\nShould the bot buy "DoomTech Moglin Minion BattlePet" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YokaiTreasureMerge.select,
});

export default function main(): void {
    const script = new YokaiTreasureMerge();
    Core.bankingBlackList.push(
        "Wuji Steel",
        "Mercury Phial",
        "Tengu Typhoon Cutlass",
        "Stealthy Sea Hair",
        "Stealthy Sea Locks",
        "Stealthy Sea Patch Hair",
        "Stealthy Sea Patch Locks",
        "Moonlit Steel Rapier",
        "Iron Flight Cutlass",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
