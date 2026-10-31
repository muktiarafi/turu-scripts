/*
name: Second First Mate
description: Farms "All Drops" From Quest: "A Second First Mate".
tags: a second first mate, set, pirate, tlapd, seasonal, talk-like-a-pirate-day
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/SecondFirstMateQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class SecondFirstMate {
    getDrops(): void {
        let i = 0;

        const RewardOptions = Core.ensureLoad(7714).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        const QuestRewards = RewardOptions.map((x) => x.name);

        Core.equipClass(ClassType.Farm);
        Core.registerQuests(7714);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("pirates", "Undead Pirate", "Undead Pirates Cleared", 35);
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
    const script = new SecondFirstMate();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
