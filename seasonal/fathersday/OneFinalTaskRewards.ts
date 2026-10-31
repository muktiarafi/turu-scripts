/*
name: OneFinalTaskRewards.cs
description: this script will farm all rewards from quest OneFinalTask in /nursery
tags: horstio, rewards, one, final, task
*/
// Port of Scripts/Seasonal/FathersDay/OneFinalTaskRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { HoratioQuests } from "./HoratioQuests";

const HQ = new HoratioQuests();

export class OneFinaltTask {
    doQuest(): void {
        this.questsIfNeeded();
        this.autoReward();
    }

    autoReward(questID = 6948): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        bot.drops.add(...Core.questRewards(questID));

        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id)) {
                Core.ensureAccept(questID);
                Core.huntMonster("nursery", "Skeletal Minion", "Treasure Found", 10, { isTemp: false, log: false });
                Core.ensureComplete(questID, item.id);
            }
        }
    }

    questsIfNeeded(): void {
        HQ.horatio();
    }
}

export default function main(): void {
    const script = new OneFinaltTask();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(true);
}
