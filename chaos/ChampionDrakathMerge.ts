/*
name: Champion Drakath Merge
description: This bot will farm the items belonging to the selected mode for the Champion Drakath Merge [2055] in /championdrakath
tags: champion, drakath, merge, championdrakath, parallel, chaos, amulet, fragments, lords, a, b, empowered, original, avengers, greatsword, avenger, polished, dragon, control, supreme, arcane, colorful, rose, royal, trace, kitsunes, chaotic, guilt, chaorrupter, locked
*/
// Port of Scripts/Chaos/ChampionDrakathMerge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { DrakathArmorBot } from "./DrakathsArmor";
import { CoreAdvanced, type mergeOptionsEnum } from "../core/CoreAdvanced";
import { ClassType, Core } from "../core/CoreBots";
import { Core13LoC } from "../story/lordsofchaos/Core13LoC";

const Adv = new CoreAdvanced();
const LOC = new Core13LoC();
const DAB = new DrakathArmorBot();

export class ChampionDrakathMerge {
    // [Can Change] This should only be changed by the author.
    // If true, it will not stop the script if the default case triggers and the user chose to only get mats
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
                case "Chaos Lord Alteon":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(20671);
                    Core.huntMonster("swordhavenfalls", "Chaos Lord Alteon", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Drakath Armor":
                    DAB.drakathArmorQuest();
                    break;
                case "Chaos Avenger Armor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Adv.buyItem("championdrakath", 2056, req.name, quant, undefined, undefined, false);
                    break;
                case "Kitsune's Chaos Mask":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    this.farmKitsunesMask(req.name);
                    break;
                case "Tibicenas":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("djinn", "Tibicenas", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Soul of Chaos Armor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("dreamnexus", "Khasaanda", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Iadoa":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("mqlesson", "Dragonoid", "Dragonoid of Hours", undefined, { isTemp: false });
                    Core.huntMonster("timespace", "Chaos Lord Iadoa", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Chaos Lionfang Armor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    bot.quests.updateQuest(2814);
                    Core.huntMonster("stormtemple", "Chaos Lord Lionfang", req.name, quant, {
                        isTemp: req.temp,
                        log: false,
                    });
                    break;
                case "Chaos Shogun Armor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.killKitsune(req.name, quant, { log: false });
                    break;
                case "Wolfwing Armor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("wolfwing", "Wolfwing", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Escherion's Robe":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.killEscherion(req.name, quant, { log: false });
                    break;
                case "Champion Drakath Insignia":
                    Core.farmingLogger(req.name, quant);
                    while (!bot.shouldExit && !Core.checkInventory(req.name, quant)) {
                        Core.logger(
                            "You have to kill Champion Drakath weekly to get his insignias, use your army to kill it easily",
                        );
                        return;
                    }
                    break;
                case "Original Drakath Armor":
                    DAB.drakathOriginalArmor();
                    break;
                case "Blade of Chaos":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ultradrakath", "Champion of Chaos", req.name, quant, {
                        isTemp: false,
                        log: false,
                    });
                    bot.wait.forPickup(req.name);
                    break;
                case "Xiang Chaos":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Adv.gearStore(undefined, { enhAfter: true });
                    Core.killXiang("Xiang Chaos");
                    Adv.gearStore(true, { enhAfter: true });
                    break;
                case "Chaos Avenger's Greatsword":
                    Core.equipClass(ClassType.Solo);
                    Adv.buyItem("championdrakath", 2056, req.name);
                    break;
                case "Vath's Chaotic Dragonlord Armor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Farm);
                    Core.addDrop(req.id);
                    Core.killVath(req.name, quant, { log: false });
                    break;
                case "Legendary Sword of Dragon Control":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.killVath(req.name, quant);
                    bot.wait.forPickup(req.name);
                    break;
                case "The Supreme Arcane Staff":

                case "Ledgermayne":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("ledgermayne", "Ledgermayne", req.name, quant, { isTemp: req.temp, log: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Discordia Rose of Chaos":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("palooza", "Chaos Lord Discordia", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
                case "Discordia Armor":
                    if (req.upgrade && !Core.isMember) {
                        Core.logger(`${req.name} requires membership to farm, skipping.`);
                        return;
                    }
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.addDrop(req.id);
                    Core.huntMonster("palooza", "Discordia", req.name, quant, { isTemp: req.temp, log: false });
                    break;
                case "Chaos Rose":
                    Core.farmingLogger(req.name, quant);
                    Core.equipClass(ClassType.Solo);
                    Core.huntMonster("palooza", "Chaos Lord Discordia", req.name, quant, { isTemp: false, log: false });
                    bot.wait.forPickup(req.name);
                    break;
            }
        };
        if (!Core.isCompletedBefore(8301)) {
            Core.logger('Quest "Chaos Avenger Class" required, gl.. it requires an army');
            return;
        }
        LOC.hero();
        //Only edit the map and shopID here
        Adv.startBuyAllMerge("championdrakath", 2055, findIngredients, buyOnlyThis, { buyMode });

        //#region Dont edit this part
    }

    static readonly select = [
        option.bool(
            "63575",
            "Parallel Chaos Amulet",
            'Mode: [select] only\nShould the bot buy "Parallel Chaos Amulet" ?',
            false,
        ),
        option.bool(
            "64105",
            "Fragments of the Lords A",
            'Mode: [select] only\nShould the bot buy "Fragments of the Lords A" ?',
            false,
        ),
        option.bool(
            "64106",
            "Fragments of the Lords B",
            'Mode: [select] only\nShould the bot buy "Fragments of the Lords B" ?',
            false,
        ),
        option.bool(
            "64151",
            "Empowered Drakath Armor",
            'Mode: [select] only\nShould the bot buy "Empowered Drakath Armor" ?',
            false,
        ),
        option.bool(
            "64152",
            "Empowered Original Drakath Armor",
            'Mode: [select] only\nShould the bot buy "Empowered Original Drakath Armor" ?',
            false,
        ),
        option.bool(
            "64153",
            "Empowered Blade of Chaos",
            'Mode: [select] only\nShould the bot buy "Empowered Blade of Chaos" ?',
            false,
        ),
        option.bool(
            "64154",
            "Empowered Chaos Avenger's Greatsword",
            'Mode: [select] only\nShould the bot buy "Empowered Chaos Avenger\'s Greatsword" ?',
            false,
        ),
        option.bool(
            "64155",
            "Empowered Chaos Avenger Armor",
            'Mode: [select] only\nShould the bot buy "Empowered Chaos Avenger Armor" ?',
            false,
        ),
        option.bool(
            "60988",
            "Polished Sword of Dragon Control",
            'Mode: [select] only\nShould the bot buy "Polished Sword of Dragon Control" ?',
            false,
        ),
        option.bool(
            "60990",
            "Polished Supreme Arcane Staff",
            'Mode: [select] only\nShould the bot buy "Polished Supreme Arcane Staff" ?',
            false,
        ),
        option.bool(
            "60991",
            "Colorful Chaos Rose",
            'Mode: [select] only\nShould the bot buy "Colorful Chaos Rose" ?',
            false,
        ),
        option.bool("60992", "Royal Chaos Rose", 'Mode: [select] only\nShould the bot buy "Royal Chaos Rose" ?', false),
        option.bool("74259", "Trace of Chaos", 'Mode: [select] only\nShould the bot buy "Trace of Chaos" ?', false),
        option.bool(
            "94406",
            "Empowered Kitsune's Chaos Mask",
            'Mode: [select] only\nShould the bot buy "Empowered Kitsune\'s Chaos Mask" ?',
            false,
        ),
        option.bool(
            "94407",
            "Chaotic Guilt Blade",
            'Mode: [select] only\nShould the bot buy "Chaotic Guilt Blade" ?',
            false,
        ),
        option.bool(
            "98032",
            "Chaorrupter Locked",
            'Mode: [select] only\nShould the bot buy "Chaorrupter Locked" ?',
            false,
        ),
        option.bool(
            "98043",
            "Dual Chaorrupter Locked",
            'Mode: [select] only\nShould the bot buy "Dual Chaorrupter Locked" ?',
            false,
        ),
    ];

    farmKitsunesMask(item: string | null = null): void {
        // Farm both if null, otherwise farm specific item
        const masks = item == null ? ["Kitsune's Chaos Mask", "Kitsune's Mask"] : [item];

        if ((item == null && Core.checkInventory(masks)) || (item != null && Core.checkInventory(item))) {
            return;
        }

        Core.bankingBlackList.push(
            "Lock Spell 1",
            "Lock Spell 2",
            "Mystical Chaos Runes",
            "Spy's Disclosure",
            "Bandit's Map",
            "Unusual Rocks",
            "Chaotic Talking Gem",
            "Kitsune's Mask",
            "Kitsune's Chaos Mask",
        );

        Core.addDrop(
            "Lock Spell 1",
            "Lock Spell 2",
            "Mystical Chaos Runes",
            "Spy's Disclosure",
            "Bandit's Map",
            "Unusual Rocks",
            "Chaotic Talking Gem",
            "Kitsune's Mask",
            "Kitsune's Chaos Mask",
        );

        Core.equipClass(ClassType.Farm);

        for (const mask of masks) {
            if (Core.checkInventory(mask)) {
                continue;
            }

            Core.farmingLogger(mask, 1);
            this.ensureLockSpell2();
            this.ensureLockSpell1();

            Adv.buyItem("chaosmarsh", 2365, mask);
            bot.wait.forPickup(mask);
        }
    }

    ensureLockSpell1(): void {
        if (Core.checkInventory("Lock Spell 1")) {
            return;
        }

        this.buyMysticalChaosRunes();
        Core.getMapItem(12330, 1, "warundead");
    }

    ensureLockSpell2(): void {
        if (Core.checkInventory("Lock Spell 2")) {
            return;
        }

        this.ensureLockSpell1();
        Core.getMapItem(12331, 1, "ravenloss");
    }

    buyMysticalChaosRunes(): void {
        if (Core.checkInventory("Mystical Chaos Runes")) {
            return;
        }

        this.ensureChaoticTalkingGem();
        this.ensureUnusualRocks();
        this.ensureBanditsMap();
        this.ensureSpysDisclosure();

        Adv.buyItem("relativity", 2344, "Mystical Chaos Runes");
        bot.wait.forPickup("Mystical Chaos Runes");
    }

    ensureSpysDisclosure(): void {
        if (Core.checkInventory("Spy's Disclosure")) {
            return;
        }

        Core.getMapItem(12221, 1, "museum");
    }

    ensureBanditsMap(): void {
        if (Core.checkInventory("Bandit's Map")) {
            return;
        }

        Core.huntMonster("poisonforest", "Bandit", "Bandit's Map", undefined, { isTemp: false });
    }

    ensureUnusualRocks(): void {
        if (Core.checkInventory("Unusual Rocks")) {
            return;
        }

        Core.getMapItem(12222, 1, "wargrounds");
    }

    ensureChaoticTalkingGem(): void {
        if (Core.checkInventory("Chaotic Talking Gem")) {
            return;
        }

        Core.getMapItem(12223, 1, "mountainpath");
    }
}

export const scriptOptions = defineScriptOptions(Adv.optionsStorage, [], true, {
    Generic: Adv.mergeOptions,
    Select: ChampionDrakathMerge.select,
});

export default function main(): void {
    const script = new ChampionDrakathMerge();
    Core.bankingBlackList.push(
        "Champion Drakath Insignia",
        "Escherion's Robe",
        "Vath's Chaotic Dragonlord Armor",
        "Chaos Shogun Armor",
        "Wolfwing Armor",
        "Discordia Armor",
        "Ledgermayne",
        "Tibicenas",
        "Soul of Chaos Armor",
        "Iadoa",
        "Chaos Lionfang Armor",
        "Chaos Lord Alteon",
        "Xiang Chaos",
        "Drakath Armor",
        "Original Drakath Armor",
        "Blade of Chaos",
        "Chaos Avenger's Greatsword",
        "Chaos Avenger Armor",
        "Legendary Sword of Dragon Control",
        "The Supreme Arcane Staff",
        "Discordia Rose of Chaos",
        "Chaos Rose",
        "Kitsune's Chaos Mask",
    );
    Core.setOptions();

    script.buyAllMerge();
    Core.setOptions(false);
}
