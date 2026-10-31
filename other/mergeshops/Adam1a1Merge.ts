/*
name: Adam1a1 Merge
description: Merge shop for Adam1a1 in battleunderb
tags: merge, mergeshop
*/
// Port of Scripts/Other/MergeShops/Adam1a1Merge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Adam1a1Quest } from "../../story/Adam1a1Quests";
import { Banished } from "../../story/Banished";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const banished = new Banished();
const adam1a1Quest = new Adam1a1Quest();

export class Adam1a1Merge {
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
                case "DoomKitten's Hairball":
                    Core.killDoomKitten(req.name, req.quantity, { isTemp: req.temp });
                    break;
                case "Shard of Chaos":
                    Core.killMonster("blindingsnow", "r5", "Spawn", "*", "Shard of Chaos", 100, { isTemp: false });
                    break;
                case "Diabolical Ectomancer":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(7880);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("banished", "Desterrat Moya", "Infected Tentacle");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Fresh Ectoplasm":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8009);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("vendorbooths", "Caffeine Imp", "Coffee Beans", 10);
                        Core.huntMonster("djinn", "Lamia", "Tasty Poison", 10);
                        Core.huntMonster("charredpath", "Toxic Wisteria", "Necessary Antidote");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "IOU Slip":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8009);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("vendorbooths", "Caffeine Imp", "Coffee Beans", 10);
                        Core.huntMonster("djinn", "Lamia", "Tasty Poison", 10);
                        Core.huntMonster("charredpath", "Toxic Wisteria", "Necessary Antidote");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "EctoBlade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("shadowfallwar", "Skeletal Fire Mage", "EctoBlade", undefined, {
                            isTemp: false,
                        });
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Ectoplasmic Chains":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8010);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("temple", "Doomwood Ectomancer", "Refined Ectoplasm", 10);
                        Core.huntMonster("ectocave", "Ektorax", "Ektorax's Ectoplasm");
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Bongo Cart Pet":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop("Love Token", "Magenta Dye", "Fresh Ectoplasm");
                    Core.addDrop(21567);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.ensureAccept(8013);
                        // Red Rose
                        if (!Core.checkInventory("Red Rose", undefined, { toInv: false })) {
                            while (!bot.shouldExit && !Core.checkInventory(21567, 10)) {
                                Core.huntMonster("battlewedding", "Silver Knight", undefined, undefined, {
                                    isTemp: false,
                                });
                            }
                            Adv.buyItem("battlewedding", 788, "Red Rose");
                        }
                        // Bangin' Bongo Cat Hair
                        if (!Core.checkInventory("Bangin' Bongo Cat Hair")) {
                            Adv.buyItem("battleontown", 907, "Bangin' Bongo Cat Hair");
                        }
                        // Pink Rose
                        if (!Core.checkInventory("Pink Rose")) {
                            Core.registerQuests(1489);
                            while (!bot.shouldExit && !Core.checkInventory("Magenta Dye", 35)) {
                                //Flowers for the Pink Gal 1489
                                Core.huntMonster("Sandsea", "Cactus Creeper", "Fandango Flower", 5);
                                Core.killMonster("wanders", "r5", "Left", "Lotus Spider", "Lotus Flower", 4);
                            }

                            Adv.buyItem("tower", 347, "Pink Rose");
                            while (!bot.shouldExit && !Core.checkInventory(21567, 10)) {
                                Core.huntMonster("battlewedding", "Silver Knight", undefined, undefined, {
                                    isTemp: false,
                                });
                            }
                            Adv.buyItem("battlewedding", 788, "Red Rose");
                        }

                        // Stray Ectoplasm
                        if (!Core.checkInventory("Stray Ectoplasm")) {
                            while (!bot.shouldExit && !Core.checkInventory("Fresh Ectoplasm", 15)) {
                                Core.ensureAccept(8009);
                                Core.huntMonster("vendorbooths", "Caffeine Imp", "Coffee Beans", 10);
                                Core.huntMonster("djinn", "Lamia", "Tasty Poison", 10);
                                Core.huntMonster("charredpath", "Toxic Wisteria", "Necessary Antidote");
                                Core.ensureComplete(8009);
                                bot.wait.forPickup("Fresh Ectoplasm");
                            }
                            Adv.buyItem("battleunderb", 1990, "Stray Ectoplasm");
                        }
                        Core.ensureComplete(8013);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Reho's Golden Sword Hilt":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.registerQuests(8011);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("extinction", "Slimed Drone", "Iron II.0", 4, { isTemp: false });
                        Core.huntMonster("doomwood", "Doomwood Treeant", "Wood", 10);
                        Core.huntMonster("crashsite", "Dwakel Blaster", "Big Iron Bolts", 10);
                        Core.huntMonster("portalmaze", "Time Wraith", "Piece of Cake", 5);
                        bot.wait.forPickup(req.name);
                    }
                    Core.cancelRegisteredQuests();
                    break;
                case "Awethur's Accoutrements":
                    Adv.buyItem("museum", 631, "Awethur's Accoutrements");
                    break;
            }
        };
        //Only edit the map and shopID here
        banished.hikarisQuests();
        adam1a1Quest.storyline();
        Farm.bladeofAweREP(10, false);
        Adv.startBuyAllMerge("battleunderb", 1990, findIngredients, buyOnlyThis, { buyMode });
        //#region Dont edit this part
    }

    static readonly select = [
        option.bool("60473", "Ecto Enforcer", 'Mode: [select] only\nShould the bot buy "Ecto Enforcer" ?', false),
        option.bool(
            "60481",
            "Ecto Enforcer Axe",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Axe" ?',
            false,
        ),
        option.bool(
            "60477",
            "Ecto Enforcer Cape",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Cape" ?',
            false,
        ),
        option.bool(
            "60478",
            "Ecto Enforcer Cape + Weapons",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Cape + Weapons" ?',
            false,
        ),
        option.bool(
            "60474",
            "Ecto Enforcer Helm Jedna",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Helm Jedna" ?',
            false,
        ),
        option.bool(
            "60475",
            "Ecto Enforcer Helm Dva",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Helm Dva" ?',
            false,
        ),
        option.bool(
            "60476",
            "Ecto Enforcer Helm Tri",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Helm Tri" ?',
            false,
        ),
        option.bool(
            "60500",
            "Battle Bongo Cart Pet",
            'Mode: [select] only\nShould the bot buy "Battle Bongo Cart Pet" ?',
            false,
        ),
        option.bool("60515", "Stray Ectoplasm", 'Mode: [select] only\nShould the bot buy "Stray Ectoplasm" ?', false),
        option.bool("60516", "Doomed Ectoplasm", 'Mode: [select] only\nShould the bot buy "Doomed Ectoplasm" ?', false),
        option.bool(
            "60517",
            "Blessed Ectoplasm",
            'Mode: [select] only\nShould the bot buy "Blessed Ectoplasm" ?',
            false,
        ),
        option.bool(
            "60518",
            "Chaotic Ectoplasm",
            'Mode: [select] only\nShould the bot buy "Chaotic Ectoplasm" ?',
            false,
        ),
        option.bool(
            "60480",
            "Ecto Enforcer Staff",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Staff" ?',
            false,
        ),
        option.bool(
            "60479",
            "Ecto Enforcer Sword",
            'Mode: [select] only\nShould the bot buy "Ecto Enforcer Sword" ?',
            false,
        ),
        option.bool("60491", "Reho's Sword", 'Mode: [select] only\nShould the bot buy "Reho\'s Sword" ?', false),
        option.bool(
            "60490",
            "Reho's Golden Sword",
            'Mode: [select] only\nShould the bot buy "Reho\'s Golden Sword" ?',
            false,
        ),
        option.bool(
            "60492",
            "Ecto Blade of Insanity",
            'Mode: [select] only\nShould the bot buy "Ecto Blade of Insanity" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: Adam1a1Merge.select,
});

export default function main(): void {
    const script = new Adam1a1Merge();
    Core.bankingBlackList.push(
        "Diabolical Ectomancer",
        "Fresh Ectoplasm",
        "IOU Slip",
        "EctoBlade",
        "Ectoplasmic Chains",
        "Bongo Cart Pet",
        "Reho's Golden Sword Hilt",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
