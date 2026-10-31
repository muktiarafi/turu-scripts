/*
name: For The Crater Good Quest
description: This will finish the For The Crater Good Quest.
tags: quest, crater, big crater, summer-break, the crater good, rock bottom
*/
// Port of Scripts/Seasonal/SummerBreak/ForTheCraterGoodQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CraterHouseMerge } from "./CraterHouseMerge";

const CHM = new CraterHouseMerge();

export class ForTheCraterGood {
    doQuest(): void {
        if (
            Core.checkInventory(Core.questRewards(9782), undefined, { toInv: false }) ||
            !Core.isSeasonalMapActive("summerbreak")
        ) {
            return;
        }

        if (!Core.checkInventory("Big Crater")) {
            Core.logger("Big Crater is missing. Buying it now.");
            CHM.buyAllMerge("Big Crater");
        }

        Core.addDrop(...Core.questRewards(9782));
        Core.ensureAccept(9782);

        // Space Helm
        if (!Core.checkInventory("Space Helm")) {
            Core.equipClass(ClassType.Farm);
            Core.addDrop("Space Helm");
            Core.ensureAccept(2855);
            Core.huntMonster("j6moon", "Space Raptor", "Note from J6");
            Core.ensureComplete(2855);
        }

        // Ultimate Security Bot Defeated
        if (!Core.checkInventory("Ultimate Security Bot Defeated", 600)) {
            Core.equipClass(ClassType.Farm);
            Core.ensureAccept(1176);
            Core.huntMonster("moonyardb", "Robo Guard", "Ultimate Security Bot Defeated", 600, { isTemp: false });
            bot.quests.unregisterQuests(1176);
        }

        // Kua-Toa Dagger
        if (!Core.checkInventory("Kua-Toa Dagger")) {
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("uppercity", "Drow Assassin", "Kua-Toa Dagger", 1, { isTemp: false });
        }

        // Enchanted Titan Helm +15
        if (!Core.checkInventory("Enchanted Titan Helm +15")) {
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("darkheart", "Gaiazor", "Enchanted Titan Helm +15", 1, { isTemp: false });
        }

        // Living Tree Titan
        if (!Core.checkInventory(30203)) {
            Core.equipClass(ClassType.Solo);
            bot.quests.updateQuest(4361);
            Core.farmingLogger("Living Tree Titan");
            while (!Core.checkInventory(30203)) {
                Core.huntMonster("treetitanbattle", "Dakka the Dire Dragon", undefined, undefined, { log: false });
            }
        }

        Core.ensureComplete(9782);
    }
}

export default function main(): void {
    const script = new ForTheCraterGood();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(false);
}
