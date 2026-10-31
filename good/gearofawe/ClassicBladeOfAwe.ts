/*
name: Classic Blade of Awe
description: This bot will farm Classic Blade of Awe.
tags: classic, blade, blade of awe, awe, good, weapon, original treasure chest, mysterious chest, unlocking the chest
*/
// Port of Scripts/Good/GearOfAwe/ClassicBladeOfAwe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";
import { TreasureHuntQuest } from "../../other/TreasureHuntQuestRewards";

const Adv = new CoreAdvanced();
const THQ = new TreasureHuntQuest();

export class ClassicBladeOfAwe {
    getCBoA(): void {
        if (Core.checkInventory("Classic Blade of Awe", undefined, { toInv: false })) {
            return;
        }

        this.getChest();

        Core.logger("Getting Classic Blade of Awe");
        Core.addDrop("Classic Blade of Awe");

        Core.ensureAccept(9705);
        // Unlocking the Chest
        if (!Core.checkInventory("Pearl Dragon Blade")) {
            Adv.buyItem("vendorbooths", 730, "Pearl Dragon Blade");
        }
        Core.equipClass(ClassType.Solo);
        Core.huntMonster("aqlesson", "Akriloth", "Serpent Tongue", undefined, { isTemp: false });
        if (!Core.checkInventory("Big 100K")) {
            Adv.buyItem("swordhaven", 3, "Big 100K");
        }
        Core.huntMonster("aqlesson", "Carnax", "Carnax Essence", 100, { isTemp: false });
        Core.ensureComplete(9705);
    }

    getChest(): void {
        if (Core.checkInventory("Original Treasure Chest")) {
            return;
        }

        Core.logger("Getting Original Treasure Chest");
        Core.addDrop("Original Treasure Chest", "Wall Awe Plaque");

        Core.equipClass(ClassType.Solo);
        if (!bot.quests.isUnlocked(9704)) {
            Core.ensureAccept(8757);
            // Awe Enhancements At Home
            Core.huntMonster("banished", "Desterrat Moya", "Apocryphal Blade Of The Truth", undefined, {
                isTemp: false,
            });
            Core.ensureComplete(8757);
        }
        Core.ensureAccept(9704);
        // Mysterious Chest
        Core.huntMonster("summon", "Blood minion", "Protector of Lore", undefined, { isTemp: false });
        THQ.doQuest(true);
        Core.equipClass(ClassType.Farm);
        Core.huntMonster("marsh2", "Thrax Ironhide", "Tyrant Blade", undefined, { isTemp: false });
        Core.ensureComplete(9704);
    }
}

export default function main(): void {
    const script = new ClassicBladeOfAwe();
    Core.setOptions();

    script.getCBoA();

    Core.setOptions(false);
}
