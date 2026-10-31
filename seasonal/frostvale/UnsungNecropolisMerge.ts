/*
name: Unsung Necropolis Merge
description: This bot will farm the items belonging to the selected mode for the Unsung Necropolis Merge [2652] in /unsungnecropolis
tags: unsung, necropolis, merge, unsungnecropolis, angel, azaveyr, wardens, angels, warden, morph, saviors, shadow, crown, royal, convalescence, ivoryfall, dragonblood, crest, snow, gale, cloak, arctic, vestige, tail, wings, ivoryblood, battleaxe, battleaxes, great, shining, dragons, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/UnsungNecropolisMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Adv = new CoreAdvanced();
const Frost = new CoreFrostvale();

export class UnsungNecropolisMerge {
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
                //#region Items not setup
                case "Tattered Page":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("unsungnecropolis", "Unsung Knight", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Unsung Warden Hair":

                case "Unsung Angel Locks":

                case "Azurefall Dragonblood":

                case "Azurefall Helm":

                case "Azurefall Crest":

                case "Ice Gale Cape":

                case "Ice Gale Cloak":

                case "Glacial Vestige Tail":

                case "Glacial Vestige Wings":

                case "Glacial Vestige Wings and Tail":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("unsungnecropolis", "The Unsung", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Non-Melt Ice":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        if (Core.checkInventory(57565)) {
                            Core.huntMonsterQuestChoose(
                                10539,
                                null,
                                ["unsungnecropolis", "The Unsung", ClassType.Solo],
                                ["unsungnecropolis", "Unsung Warrior", ClassType.Farm],
                                ["unsungnecropolis", "Bone Dragonling", ClassType.Farm],
                            );
                        } else {
                            Core.huntMonsterQuest(
                                Core.isMember ? 10538 : 10537,
                                ["unsungnecropolis", "The Unsung", ClassType.Solo],
                                ["unsungnecropolis", "Unsung Warrior", ClassType.Farm],
                                ["unsungnecropolis", "Bone Dragonling", ClassType.Farm],
                            );
                        }
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Azureblood Blade":

                case "Azureblood Great Axe":

                case "Azureblood Great Axes":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("unsungnecropolis", "Dracolich Sole", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Azureblood Battleaxe":

                case "Azureblood Battleaxes":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("unsungnecropolis", "Dracolich Blain", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Whistler Bullion":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.addDrop(req.id);
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.huntMonsterQuest(
                            Core.isMember ? 10525 : 10524,
                            ["frostvalgala", "Unsung Queen", ClassType.Solo],
                            ["frostvalgala", "Unsung Knight", ClassType.Farm],
                            ["frostvalgala", "Unsung Beast", ClassType.Farm],
                        );
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Uncut Ruby":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    if (Core.isSeasonalMapActive("wentira")) {
                        Core.huntMonster("wentira", "Pesugihan Boar", req.name, quant, { isTemp: false, log: false });
                    } else {
                        Core.huntMonster("frostvalgala", "Vaughn Knight", req.name, quant, {
                            isTemp: false,
                            log: false,
                        });
                    }
                    break;
                case "Gleaming Ore":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.huntMonster("castleparty", "Treasure Chest", req.name, quant, { isTemp: req.temp });
                    break;
                //#endregion
            }
        };
        Frost.unsungNecropolis();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("unsungnecropolis", 2652, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("97857", "Angel of Azaveyr", 'Mode: [select] only\nShould the bot buy "Angel of Azaveyr" ?', false),
        option.bool(
            "97858",
            "Unsung Warden's Mask",
            'Mode: [select] only\nShould the bot buy "Unsung Warden\'s Mask" ?',
            false,
        ),
        option.bool(
            "97859",
            "Unsung Angel's Mask",
            'Mode: [select] only\nShould the bot buy "Unsung Angel\'s Mask" ?',
            false,
        ),
        option.bool(
            "97860",
            "Unsung Warden Morph",
            'Mode: [select] only\nShould the bot buy "Unsung Warden Morph" ?',
            false,
        ),
        option.bool(
            "97861",
            "Unsung Angel Visage",
            'Mode: [select] only\nShould the bot buy "Unsung Angel Visage" ?',
            false,
        ),
        option.bool(
            "97866",
            "Savior's Shadow Cape",
            'Mode: [select] only\nShould the bot buy "Savior\'s Shadow Cape" ?',
            false,
        ),
        option.bool(
            "97867",
            "Crown of the Unsung",
            'Mode: [select] only\nShould the bot buy "Crown of the Unsung" ?',
            false,
        ),
        option.bool(
            "97868",
            "Royal Convalescence",
            'Mode: [select] only\nShould the bot buy "Royal Convalescence" ?',
            false,
        ),
        option.bool(
            "97869",
            "Dual Royal Convalescence",
            'Mode: [select] only\nShould the bot buy "Dual Royal Convalescence" ?',
            false,
        ),
        option.bool(
            "98034",
            "Ivoryfall Dragonblood",
            'Mode: [select] only\nShould the bot buy "Ivoryfall Dragonblood" ?',
            false,
        ),
        option.bool("98035", "Ivoryfall Helm", 'Mode: [select] only\nShould the bot buy "Ivoryfall Helm" ?', false),
        option.bool("98036", "Ivoryfall Crest", 'Mode: [select] only\nShould the bot buy "Ivoryfall Crest" ?', false),
        option.bool("98037", "Snow Gale Cape", 'Mode: [select] only\nShould the bot buy "Snow Gale Cape" ?', false),
        option.bool("98038", "Snow Gale Cloak", 'Mode: [select] only\nShould the bot buy "Snow Gale Cloak" ?', false),
        option.bool(
            "98039",
            "Arctic Vestige Tail",
            'Mode: [select] only\nShould the bot buy "Arctic Vestige Tail" ?',
            false,
        ),
        option.bool(
            "98040",
            "Arctic Vestige Wings",
            'Mode: [select] only\nShould the bot buy "Arctic Vestige Wings" ?',
            false,
        ),
        option.bool(
            "98041",
            "Arctic Vestige Wings and Tail",
            'Mode: [select] only\nShould the bot buy "Arctic Vestige Wings and Tail" ?',
            false,
        ),
        option.bool("98042", "Ivoryblood Blade", 'Mode: [select] only\nShould the bot buy "Ivoryblood Blade" ?', false),
        option.bool(
            "98044",
            "Ivoryblood Battleaxe",
            'Mode: [select] only\nShould the bot buy "Ivoryblood Battleaxe" ?',
            false,
        ),
        option.bool(
            "98045",
            "Ivoryblood Battleaxes",
            'Mode: [select] only\nShould the bot buy "Ivoryblood Battleaxes" ?',
            false,
        ),
        option.bool(
            "98046",
            "Ivoryblood Great Axe",
            'Mode: [select] only\nShould the bot buy "Ivoryblood Great Axe" ?',
            false,
        ),
        option.bool(
            "98048",
            "Ivoryblood Great Axes",
            'Mode: [select] only\nShould the bot buy "Ivoryblood Great Axes" ?',
            false,
        ),
        option.bool(
            "98058",
            "Shining Dragon's Blade of Frostvale",
            'Mode: [select] only\nShould the bot buy "Shining Dragon\'s Blade of Frostvale" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: UnsungNecropolisMerge.select,
});

export default function main(): void {
    const script = new UnsungNecropolisMerge();
    Core.bankingBlackList.push(
        "Tattered Page",
        "Unsung Warden Hair",
        "Unsung Angel Locks",
        "Non-Melt Ice",
        "Azurefall Dragonblood",
        "Azurefall Helm",
        "Azurefall Crest",
        "Ice Gale Cape",
        "Ice Gale Cloak",
        "Glacial Vestige Tail",
        "Glacial Vestige Wings",
        "Glacial Vestige Wings and Tail",
        "Azureblood Blade",
        "Azureblood Battleaxe",
        "Azureblood Battleaxes",
        "Azureblood Great Axe",
        "Azureblood Great Axes",
        "Whistler Bullion",
        "Uncut Ruby",
        "Gleaming Ore",
    );

    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
