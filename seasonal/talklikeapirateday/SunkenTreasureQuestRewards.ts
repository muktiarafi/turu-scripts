/*
name: Sunken Treasure Quest Rewards
description: Farms "All Drops" From Quest: "Sunken Treasure?".
tags: sunken treasure, drops, set, pirate, tlapd, talk-like-a-pirate-day, seasonal
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/SunkenTreasureQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class SunkenTreasure {
    getAll(): void {
        let i = 0;

        const RewardOptions = Core.ensureLoad(7715).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        const QuestRewards = RewardOptions.map((x) => x.name);

        Core.equipClass(ClassType.Farm);
        Core.registerQuests(7715);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("Pirates", "Shark Bait", "Waterlogged Chest", undefined, { log: false });
                    Core.huntMonster("Pirates", "Fishman Soldier", "Rusty Key", undefined, { log: false });
                    bot.wait.forPickup(Reward.name);

                    i++;

                    if (i % 5 === 0) {
                        Core.jumpWait();
                        Core.toBank(...QuestRewards);
                    }
                }
            }
        }
        Core.cancelRegisteredQuests();
        Core.toBank(...QuestRewards);
    }
}

export default function main(): void {
    const script = new SunkenTreasure();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
