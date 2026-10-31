/*
name: Bright Paladin Presents Quest Rewards
description: This script will farm all the quest rewards from "Bright Paladin Presents" quest in /eventhub
tags: seasonal, birthday, ascended, paladin, axe, hammer, mace, blade, light, rewards
*/
// Port of Scripts/Seasonal/AqwBirthday/BrightPaladinPresentsRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class BrightPaladinPresents {
    doQuest(): void {
        this.autoReward(6553);
        //-----|
    }

    autoReward(questID = 0): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        bot.drops.add(...Core.questRewards(questID));

        Core.equipClass(ClassType.Solo);
        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id)) {
                Core.ensureAccept(questID);
                Core.huntMonster("birthday", "Birthday Cake", "Slice of Cake", undefined, { log: false });
                Core.huntMonster("birthday", "Birthday Cake", "Fork", undefined, { log: false });
                Core.huntMonster("birthday", "Birthday Cake", "Holy Wasabi", undefined, { log: false });
                Core.ensureComplete(questID, item.id);
            }
        }
    }
}

export default function main(): void {
    const script = new BrightPaladinPresents();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(true);
}
