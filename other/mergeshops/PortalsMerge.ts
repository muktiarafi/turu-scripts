/*
name: Portals Merge
description: This bot will farm the items belonging to the selected mode for the Portals Merge [2585] in /basecamp
tags: portals, merge, basecamp, portal, to, grand, inquisitor, darkon, beast, headed, dracolich, red, dragon, shadowfall, fortress, swordhaven, castle, hydra, challenge, kathool, mana, golem, escherion, chaos, king, alteon, azalith, doom, vault, slugbutter, nulgaths, hidden, grotto
*/
// Port of Scripts/Other/MergeShops/PortalsMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { CoreAdvanced, type mergeOptionsEnum } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreFarms } from "../../core/CoreFarms";
import { BaseCamp } from "../../story/BaseCamp";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const Dailies = new CoreDailies();
const BC = new BaseCamp();

export class PortalsMerge {
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
                case "Golden Shadow Breaker":
                    Core.farmingLogger("Golden Shadow Breaker", quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(857);
                    Core.huntMonster("citadel", "Grand Inquisitor", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Banana":
                    Core.farmingLogger("Banana", quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(52924);
                    if (Core.checkInventory(52924)) {
                        Core.logger("Preselling existing bananas as it can break.. somehow (AE fuckery?)");
                        Core.sellItem(52924, undefined, { all: true });
                    }
                    Core.registerQuests(7324);
                    Core.huntMonster("arcangrove", "Gorillaphant", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Ingredients?":

                case "Binky Companion":
                    Core.farmingLogger("Ingredients?", quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(52925);
                    Core.huntMonster("doomvault", "Binky", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                        publicRoom: true,
                    });
                    break;
                case "Iron Draconian Sword":
                    Core.farmingLogger("Iron Draconian Sword", quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(571);
                    Core.huntMonster("lair", "Purple Draconian", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Water Draconian Sword":
                    Core.farmingLogger("Water Draconian Sword", quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(568);
                    Core.huntMonster("lair", "Water Draconian", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Venom Draconian Sword":
                    Core.farmingLogger("Venom Draconian Sword", quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(570);
                    Core.huntMonster("lair", "Venom Draconian", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Spear of the Deep One":
                    Core.farmingLogger("Spear of the Deep One", quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(79498);
                    Core.huntMonster("deepchaos", "Kathool", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "1st Lord Of Chaos Helm":
                    Core.farmingLogger("1st Lord Of Chaos Helm", quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(1173);
                    Core.killEscherion(req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Chaos King Crown":

                case "Chaos Lord Alteon":
                    Core.farmingLogger("Chaos King Crown", quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(20671);
                    Core.huntMonster("swordhavenfalls", "Chaos Lord Alteon", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Tainted Soul":
                    Core.farmingLogger("Tainted Soul", quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(4960);
                    Core.huntMonster("evilmarsh", "Tainted Soul", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                //#endregion
                //#region Known items
                case "Beast Soul":
                    if (Core.checkInventory(req.name, quant)) {
                        break;
                    }
                    Core.farmingLogger(req.name, quant);
                    Adv.gearStore(false);
                    if (Core.checkInventory("ArchPaladin")) {
                        Core.equip("ArchPaladin");
                    } else {
                        Core.equipClass(ClassType.Solo);
                    }
                    Core.huntMonster("sevencircleswar", "The Beast", req.name, quant, {
                        isTemp: false,
                        publicRoom: true,
                    });
                    Adv.gearStore(true, { enhAfter: true });
                    break;
                case "Undead Energy":
                    Farm.battleUnderB("Undead Energy", quant);
                    break;
                case "Silver":
                    Dailies.mineCrafting(["Silver"], quant);
                    break;
                case "Mammoth Crusher Blade":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.huntMonster("lair", "Bronze Draconian", req.name, quant, { isTemp: false, log: false });
                    break;
                case "Hydra Scale Piece":
                    Core.huntMonster("hydrachallenge", "Hydra Head 25", req.name, quant, { isTemp: false, log: true });
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
                case "Celestial Quintessence":
                    Core.equipClass(ClassType.Farm);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.huntMonster("CelestialPast", "Blessed Bear", req.name, quant, { isTemp: false });
                        Core.huntMonster("CelestialPast", "Blessed Deer", req.name, quant, { isTemp: false });
                        bot.wait.forPickup(req.name);
                    }
                    break;
                case "Eternity Blade":
                    Core.equipClass(ClassType.Solo);
                    Core.ensureAccept(3485);
                    Core.huntMonster("towerofdoom10", "Slugbutter", "Eternity Blade");
                    Core.ensureComplete(3485);
                    break;
                //#endregion
            }
        };
        BC.storyLine();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("basecamp", 2585, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "93840",
            "Portal to the Grand Inquisitor",
            'Mode: [select] only\nShould the bot buy "Portal to the Grand Inquisitor" ?',
            false,
        ),
        option.bool("93850", "Portal to Darkon", 'Mode: [select] only\nShould the bot buy "Portal to Darkon" ?', false),
        option.bool(
            "93865",
            "Portal to The Beast",
            'Mode: [select] only\nShould the bot buy "Portal to The Beast" ?',
            false,
        ),
        option.bool(
            "93861",
            "Portal to 5-Headed Dracolich",
            'Mode: [select] only\nShould the bot buy "Portal to 5-Headed Dracolich" ?',
            false,
        ),
        option.bool(
            "93858",
            "Portal to the Red Dragon",
            'Mode: [select] only\nShould the bot buy "Portal to the Red Dragon" ?',
            false,
        ),
        option.bool(
            "93849",
            "Portal to Shadowfall Fortress",
            'Mode: [select] only\nShould the bot buy "Portal to Shadowfall Fortress" ?',
            false,
        ),
        option.bool(
            "93852",
            "Portal to Swordhaven Castle",
            'Mode: [select] only\nShould the bot buy "Portal to Swordhaven Castle" ?',
            false,
        ),
        option.bool(
            "93855",
            "Portal to 3-Headed Hydra (Challenge)",
            'Mode: [select] only\nShould the bot buy "Portal to 3-Headed Hydra (Challenge)" ?',
            false,
        ),
        option.bool(
            "93843",
            "Portal to Kathool",
            'Mode: [select] only\nShould the bot buy "Portal to Kathool" ?',
            false,
        ),
        option.bool(
            "93846",
            "Portal to the Mana Golem",
            'Mode: [select] only\nShould the bot buy "Portal to the Mana Golem" ?',
            false,
        ),
        option.bool(
            "93848",
            "Portal to Escherion",
            'Mode: [select] only\nShould the bot buy "Portal to Escherion" ?',
            false,
        ),
        option.bool(
            "93868",
            "Portal to Chaos King Alteon (Challenge)",
            'Mode: [select] only\nShould the bot buy "Portal to Chaos King Alteon (Challenge)" ?',
            false,
        ),
        option.bool(
            "93836",
            "Portal to Azalith",
            'Mode: [select] only\nShould the bot buy "Portal to Azalith" ?',
            false,
        ),
        option.bool(
            "93845",
            "Portal to Doom Vault",
            'Mode: [select] only\nShould the bot buy "Portal to Doom Vault" ?',
            false,
        ),
        option.bool(
            "93866",
            "Portal to Slugbutter",
            'Mode: [select] only\nShould the bot buy "Portal to Slugbutter" ?',
            false,
        ),
        option.bool(
            "93847",
            "Portal to Nulgath's Hidden Grotto",
            'Mode: [select] only\nShould the bot buy "Portal to Nulgath\'s Hidden Grotto" ?',
            false,
        ),
    ];
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: PortalsMerge.select,
});

export default function main(): void {
    const script = new PortalsMerge();
    Core.bankingBlackList.push(
        "Golden Shadow Breaker",
        "Banana",
        "Ingredients?",
        "Beast Soul",
        "Undead Energy",
        "Silver",
        "Iron Draconian Sword",
        "Water Draconian Sword",
        "Venom Draconian Sword",
        "Mammoth Crusher Blade",
        "Hydra Scale Piece",
        "Spear of the Deep One",
        "Mana Golem's Core",
        "1st Lord Of Chaos Helm",
        "Chaos King Crown",
        "Chaos Lord Alteon",
        "Celestial Quintessence",
        "Binky Companion",
        "Eternity Blade",
        "Tainted Soul",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
