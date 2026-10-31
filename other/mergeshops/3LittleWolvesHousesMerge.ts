/*
name: 3LittleWolvesHousesMerge
description: null
tags: null
*/
// Port of Scripts/Other/MergeShops/3LittleWolvesHousesMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class ThreeLittleWolvesHousesMerge {
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
                case "Building Material":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6915);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("farm", "Treeant", "Wooden Planks", 5);
                        Core.huntMonster("bloodtusk", "Rhison", "Glue");
                        Core.huntMonster("crashsite", "ProtoSartorium", "Nails", 10);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Foundation Material":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(6916);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("river", "Zardman Fisher", "River Stones", 5);
                        Core.huntMonster("dwarfprison", "Balboa", "Boulder", 3);
                        Core.huntMonster("dragonplane", "Earth Elemental", "Marble");
                        Core.huntMonster("gilead", "Fire Elemental", "Flames", 3);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Decor Material":
                    Core.farmingLogger(req.name, quant);
                    Core.registerQuests(6917);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.equipClass(ClassType.Farm);
                        Core.huntMonster("farm", "Scarecrow", "Fabric", 5);
                        Core.huntMonster("undergroundlabb", "Window", "Glass", 5);
                        Core.equipClass(ClassType.Solo);
                        Core.huntMonster("goose", "Can of Paint", "Paint", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dragonrune Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Farm.elementalMasterREP();
                    Core.buyItem("dragonrune", 690, 48758);
                    bot.wait.forPickup(req.name);
                    break;
                case "Mana Golem's Core":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("elemental", "Mana Golem", "Mana Golem's Core", undefined, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Arcangrove Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Farm.arcangroveREP();
                    Core.buyItem("arcangrove", 214, 48759);
                    bot.wait.forPickup(req.name);
                    break;
                case "Falcontower Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("falconreach", "Dragon Drakath", "Falcontower Blueprint", undefined, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    Core.cancelRegisteredQuests();
                    break;
                case "Citadel Caverns Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("citadel", "Belrot the Fiend", "Citadel Caverns Blueprint", undefined, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Citadel Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Core.buyItem("citadel", 44, 48761, undefined, undefined, undefined, false);
                    bot.wait.forPickup(req.name);
                    break;
                case "Seraphic Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Core.buyItem("seraph", 1133, 48762, undefined, undefined, undefined, false);
                    bot.wait.forPickup(req.name);
                    break;
                case "Hachiko Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Core.buyItem("dragonkoiz", 95, 48763, undefined, undefined, undefined, false);
                    bot.wait.forPickup(req.name);
                    break;
                case "Clubhouse Blueprint":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("clubhouse", "Riddlelord's Golem", "Clubhouse Blueprint", undefined, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("buyhouse", 1729, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("48516", "Dragonrune House", 'Mode: [select] only\nShould the bot buy "Dragonrune House" ?', false),
        option.bool("48517", "Dragonrune Hall", 'Mode: [select] only\nShould the bot buy "Dragonrune Hall" ?', false),
        option.bool(
            "48518",
            "Arcangrove Tower House",
            'Mode: [select] only\nShould the bot buy "Arcangrove Tower House" ?',
            false,
        ),
        option.bool(
            "48765",
            "Tower of Magic House",
            'Mode: [select] only\nShould the bot buy "Tower of Magic House" ?',
            false,
        ),
        option.bool(
            "48766",
            "Falcontower House",
            'Mode: [select] only\nShould the bot buy "Falcontower House" ?',
            false,
        ),
        option.bool(
            "48767",
            "Citadel Caverns House",
            'Mode: [select] only\nShould the bot buy "Citadel Caverns House" ?',
            false,
        ),
        option.bool("48771", "Citadel House", 'Mode: [select] only\nShould the bot buy "Citadel House" ?', false),
        option.bool(
            "48768",
            "Seraphic Fortress",
            'Mode: [select] only\nShould the bot buy "Seraphic Fortress" ?',
            false,
        ),
        option.bool("48769", "Hachiko Hotel", 'Mode: [select] only\nShould the bot buy "Hachiko Hotel" ?', false),
        option.bool("48770", "Clubhouse", 'Mode: [select] only\nShould the bot buy "Clubhouse" ?', false),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ThreeLittleWolvesHousesMerge.select,
});

export default function main(): void {
    const script = new ThreeLittleWolvesHousesMerge();
    Core.bankingBlackList.push(
        "Building Material",
        "Foundation Material",
        "Decor Material",
        "Dragonrune Blueprint",
        "Mana Golem's Core",
        "Arcangrove Blueprint",
        "Falcontower Blueprint",
        "Citadel Caverns Blueprint",
        "Citadel Blueprint",
        "Seraphic Blueprint",
        "Hachiko Blueprint",
        "Clubhouse Blueprint ",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
