/*
name: Yokai Pirate Treasures Merge
description: This bot will farm the items belonging to the selected mode for the Yokai Pirate Treasures Merge [2337] in /yokaipirate
tags: yokai, pirate, treasures, merge, yokaipirate, coastal, raider, raiders, battlescarred, morph, stetson, marauders, , beard, steampowered, shotgun, cannonblast, gunner, powder, monkey, disguised, pirates, enthusiastic, eyepatch, unloaded, cannon, swashbucklers, rapiers, cutlass, rapier
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/MergeShops/YokaiPirateTreasuresMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../../core/CoreAdvanced";
import { ClassType, Core } from "../../../core/CoreBots";
import { CoreDOY } from "../../../story/dragonsofyokai/CoreDOY";

const Adv = new CoreAdvanced();
const DOY = new CoreDOY();

export class YokaiPirateTreasuresMerge {
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
                case "Pirate's Rag":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(9388);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("yokaipirate", "Lord Brentan", "Gold Leaf Brooch");
                        Core.huntMonster("yokaipirate", "Neverglades  Knight", "Knight's Emblem", 7);

                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("yokaipirate", "Disguised Pirate", "Yokai Pirate's Piece", 7);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Yokai Gunpowder":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("yokaipirate", "Serpent Warrior Monster", req.name, quant, { isTemp: req.temp });
                    break;
                case "Maurader's Mane":

                case "Maurader's Mane + Beard":

                case "Disguised Pirate's Hair":

                case "Coastal Raider's Beard":

                case "Disguised Pirate's Tricorn":

                case "Disguised Pirate's BattleGear":

                case "Disguised Pirate's Cutlass":

                case "Disguised Pirate's EyePatch":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("yokaipirate", "Disguised Pirate", req.name, quant, { isTemp: req.temp });
                    break;
                case "Swashbuckler's Rapier":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("yokaipirate", "Neverglades  Knight", req.name, quant, { isTemp: req.temp });
                    break;
            }
        };
        DOY.yokaiPirate();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("yokaipirate", 2337, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("79828", "Coastal Raider", 'Mode: [select] only\nShould the bot buy "Coastal Raider" ?', false),
        option.bool(
            "79829",
            "Coastal Raider's Battlescarred Morph",
            'Mode: [select] only\nShould the bot buy "Coastal Raider\'s Battlescarred Morph" ?',
            false,
        ),
        option.bool(
            "79831",
            "Coastal Raider's Battlescarred Visage",
            'Mode: [select] only\nShould the bot buy "Coastal Raider\'s Battlescarred Visage" ?',
            false,
        ),
        option.bool(
            "79835",
            "Coastal Raider's Stetson",
            'Mode: [select] only\nShould the bot buy "Coastal Raider\'s Stetson" ?',
            false,
        ),
        option.bool(
            "79836",
            "Coastal Marauder's Stetson + Beard",
            'Mode: [select] only\nShould the bot buy "Coastal Marauder\'s Stetson + Beard" ?',
            false,
        ),
        option.bool(
            "79837",
            "Coastal Marauder's Stetson",
            'Mode: [select] only\nShould the bot buy "Coastal Marauder\'s Stetson" ?',
            false,
        ),
        option.bool(
            "79842",
            "Steampowered Raider's Gauntlet",
            'Mode: [select] only\nShould the bot buy "Steampowered Raider\'s Gauntlet" ?',
            false,
        ),
        option.bool(
            "79843",
            "Coastal Raider's Shotgun",
            'Mode: [select] only\nShould the bot buy "Coastal Raider\'s Shotgun" ?',
            false,
        ),
        option.bool(
            "80022",
            "Cannonblast Gunner",
            'Mode: [select] only\nShould the bot buy "Cannonblast Gunner" ?',
            false,
        ),
        option.bool("80023", "Powder Monkey", 'Mode: [select] only\nShould the bot buy "Powder Monkey" ?', false),
        option.bool(
            "80025",
            "Disguised Pirate's Morph",
            'Mode: [select] only\nShould the bot buy "Disguised Pirate\'s Morph" ?',
            false,
        ),
        option.bool(
            "80027",
            "Enthusiastic Pirate's Morph",
            'Mode: [select] only\nShould the bot buy "Enthusiastic Pirate\'s Morph" ?',
            false,
        ),
        option.bool(
            "80029",
            "Enthusiastic Pirate's Eyepatch Morph",
            'Mode: [select] only\nShould the bot buy "Enthusiastic Pirate\'s Eyepatch Morph" ?',
            false,
        ),
        option.bool(
            "80031",
            "Enthusiastic Pirate's Morph",
            'Mode: [select] only\nShould the bot buy "Enthusiastic Pirate\'s Morph" ?',
            false,
        ),
        option.bool(
            "80033",
            "Unloaded Cannon Cape",
            'Mode: [select] only\nShould the bot buy "Unloaded Cannon Cape" ?',
            false,
        ),
        option.bool(
            "80040",
            "Swashbuckler's Rapiers",
            'Mode: [select] only\nShould the bot buy "Swashbuckler\'s Rapiers" ?',
            false,
        ),
        option.bool(
            "80041",
            "Disguised Pirate's Cutlass + Rapier",
            'Mode: [select] only\nShould the bot buy "Disguised Pirate\'s Cutlass + Rapier" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: YokaiPirateTreasuresMerge.select,
});

export default function main(): void {
    const script = new YokaiPirateTreasuresMerge();
    Core.bankingBlackList.push(
        "Pirate's Rag",
        "Yokai Gunpowder",
        "Coastal Raider's Beard",
        "Maurader's Mane",
        "Maurader's Mane + Beard",
        "Disguised Pirate's Hair",
        "Disguised Pirate's Tricorn",
        "Disguised Pirate's BattleGear",
        "Disguised Pirate's EyePatch",
        "Swashbuckler's Rapier",
        "Disguised Pirate's Cutlass",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
