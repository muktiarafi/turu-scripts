/*
name: Hanzo Orb Quests
description: Does the quests from either the Astral Orb Pet, or the Crimson Orb Pet
tags: astral, crimson, orb, pet, quests
*/
// Port of Scripts/Nation/Various/HanzoOrbQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class HanzoOrbQuest {
    hanzoOrb(Reward = "Any", quant = 1, AnyReward = false): void {
        let questID = 0;
        if (Core.checkInventory("Astral Orb Pet")) {
            Core.logger('Using "Astral Orb Pet Quest"');
            questID = 4020;
        } else if (Core.checkInventory("Crimson Orb Pet")) {
            Core.logger('Using "Crimson Orb Pet Quest"');
            questID = 4019;
        } else {
            Core.logger("Neither orb owned, stopping");
            return;
        }

        const rewards = Core.questRewards(questID);
        Core.addDrop(...rewards);

        Core.registerQuests(questID);
        if (AnyReward) {
            for (const item of rewards) {
                while (!bot.shouldExit && (!Core.checkInventory(item) || !bot.inventory.isMaxStack(item))) {
                    Core.huntMonster("graveyard", "Big Jack Sprat", "Jacked Eye", 5, { log: false });
                    Core.huntMonster("marsh", "Dreadspider", "Dreadspider Silk", undefined, { log: false });
                    Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Makai Fang", 5, { log: false });
                    Core.huntMonster("bludrut", "Rattlebones", "Rattle Bones", 3, { log: false });
                }
            }
        } else {
            while (!bot.shouldExit && !Core.checkInventory(Reward, quant)) {
                Core.huntMonster("graveyard", "Big Jack Sprat", "Jacked Eye", 5, { log: false });
                Core.huntMonster("marsh", "Dreadspider", "Dreadspider Silk", undefined, { log: false });
                Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Makai Fang", 5, { log: false });
                Core.huntMonster("bludrut", "Rattlebones", "Rattle Bones", 3, { log: false });
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new HanzoOrbQuest();
    Core.setOptions();

    script.hanzoOrb();
}
