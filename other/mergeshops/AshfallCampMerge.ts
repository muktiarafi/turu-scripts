/*
name: Ashfall Camp Merge
description: Farms the gear for your selected mode for the merge shop in /ashfallcamp
tags: ashfall, camp, merge, shop, iron, ore, ingot, blue, red, green, dye, fabric, dragon, scales, bile, stone
*/
// Port of Scripts/Other/MergeShops/AshfallCampMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class AshfallCampMerge {
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
                case "Fabric":

                case "Blue Dye":

                case "Red Dye":

                case "Green Dye":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5898);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        //QuarterMaster’s Supplies 5898
                        Core.huntMonster("ashfallcamp", "Lava Dragoblin", "Supply Chest", 8, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Dragon Scales":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.registerQuests(5893);
                    while (!bot.shouldExit && !Core.checkInventory(40375, quant)) {
                        //Blackrawk Magebane 5893
                        Core.huntMonster("ashfallcamp", "Blackrawk", "Blackrawk Defeated", undefined, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Defender Badge":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ashfallcamp", "Blackrawk", req.name, quant, { isTemp: false });
                    break;
                case "Flame Claws":

                case "Flame Heart":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ashfallcamp", "Smoldur", req.name, quant, { isTemp: false });
                    break;
                case "Sulphur Ore":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5899);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("ashfallcamp", "Sulphur Dracolich", "Sulphur Crystal", 10, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Iron Ore":

                case "Bile Stone": {
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    let i = 1;
                    while (!bot.shouldExit && !Core.checkInventory(req.id, quant)) {
                        Core.ensureAccept(5900);
                        Core.huntMonster("ashfallcamp", "Draconian Guard", "Iron Lump", 5, { log: false });
                        Core.huntMonster("ashfallcamp", "Draconian Guard", "Bile Drops", 3, { log: false });
                        Core.ensureComplete(5900, req.id);
                        Core.logger(`Quest completed x${i++} times: [5900] "Ingots and Outguts"`);
                        bot.wait.forPickup(req.name);
                    }
                    break;
                }
                case "Molten Lava":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(5897);
                    while (!bot.shouldExit && !Core.checkInventory(40352, quant)) {
                        Core.huntMonster("ashfallcamp", "Lava Rock", "Lava Glob", 5, { log: false });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Venom Sac":

                case "Venom Fangs":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ashfallcamp", "Infernus", req.name, quant, { isTemp: false });
                    break;
                case "Crystal Eye":

                case "Glass Horns":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ashfallcamp", "Blackrawk", req.name, quant, { isTemp: false });
                    break;
                case "Storm Heart":
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("pride", "Valsarian", req.name, quant, { isTemp: false });
                    break;
                case "Melted Glass":

                case "Copper Wire":
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("pride", "Cellar Guard", req.name, quant, { isTemp: false });
                    break;
            }
        };
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("ashfallcamp", 1422, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "40401",
            "DragonSlayer Locks",
            'Mode: [select] only\nShould the bot buy "DragonSlayer Locks" ?',
            false,
        ),
        option.bool("40402", "DragonSlayer Cut", 'Mode: [select] only\nShould the bot buy "DragonSlayer Cut" ?', false),
        option.bool(
            "40374",
            "DragonSlayer Guard",
            'Mode: [select] only\nShould the bot buy "DragonSlayer Guard" ?',
            false,
        ),
        option.bool(
            "40409",
            "Flame Dragon Armor",
            'Mode: [select] only\nShould the bot buy "Flame Dragon Armor" ?',
            false,
        ),
        option.bool(
            "40410",
            "Flame Dragon Helm",
            'Mode: [select] only\nShould the bot buy "Flame Dragon Helm" ?',
            false,
        ),
        option.bool(
            "40411",
            "Flame Dragon Cape",
            'Mode: [select] only\nShould the bot buy "Flame Dragon Cape" ?',
            false,
        ),
        option.bool(
            "40412",
            "Flame Dragon Polearm",
            'Mode: [select] only\nShould the bot buy "Flame Dragon Polearm" ?',
            false,
        ),
        option.bool(
            "40413",
            "Green Dragon Armor",
            'Mode: [select] only\nShould the bot buy "Green Dragon Armor" ?',
            false,
        ),
        option.bool(
            "40414",
            "Green Dragon Helm",
            'Mode: [select] only\nShould the bot buy "Green Dragon Helm" ?',
            false,
        ),
        option.bool(
            "40415",
            "Green Dragon Cape",
            'Mode: [select] only\nShould the bot buy "Green Dragon Cape" ?',
            false,
        ),
        option.bool(
            "40416",
            "Green Dragon Polearm",
            'Mode: [select] only\nShould the bot buy "Green Dragon Polearm" ?',
            false,
        ),
        option.bool("40405", "Ice Dragon Armor", 'Mode: [select] only\nShould the bot buy "Ice Dragon Armor" ?', false),
        option.bool("40406", "Ice Dragon Helm", 'Mode: [select] only\nShould the bot buy "Ice Dragon Helm" ?', false),
        option.bool("40407", "Ice Dragon Cape", 'Mode: [select] only\nShould the bot buy "Ice Dragon Cape" ?', false),
        option.bool(
            "40408",
            "Ice Dragon Polearm",
            'Mode: [select] only\nShould the bot buy "Ice Dragon Polearm" ?',
            false,
        ),
        option.bool(
            "40553",
            "Lightning Orb Mace",
            'Mode: [select] only\nShould the bot buy "Lightning Orb Mace" ?',
            false,
        ),
        option.bool(
            "40552",
            "Storm Drakel Warrior",
            'Mode: [select] only\nShould the bot buy "Storm Drakel Warrior" ?',
            false,
        ),
        option.bool(
            "40565",
            "Stormpowered Staff",
            'Mode: [select] only\nShould the bot buy "Stormpowered Staff" ?',
            false,
        ),
        option.bool(
            "40563",
            "Copperwire Daggers",
            'Mode: [select] only\nShould the bot buy "Copperwire Daggers" ?',
            false,
        ),
        option.bool(
            "40564",
            "Dwakelcharged Slicer",
            'Mode: [select] only\nShould the bot buy "Dwakelcharged Slicer" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: AshfallCampMerge.select,
});

export default function main(): void {
    const script = new AshfallCampMerge();
    Core.bankingBlackList.push(
        "Iron Ore",
        "Iron Ingot",
        "Bile Stone",
        "Molten Lava",
        "Fabric",
        "Blue Dye",
        "Red Dye",
        "Dragon Scale",
        "Defender Badge",
        "Flame Claws",
        "Flame Heart",
        "Sulphur Ore",
        "Venom Sac",
        "Venom Fangs",
        "Crystal Eye",
        "Glass Horns",
        "Storm Heart",
        "Melted Glass",
        "Copper Wire",
    );
    Core.setOptions();

    script.buyAllMerge();

    Core.setOptions(false);
}
