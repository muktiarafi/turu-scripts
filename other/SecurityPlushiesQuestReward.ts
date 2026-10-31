/*
name: Security Plushies Quest Rewards
description: farms quest rewards from `Security Plushies` [9731] in /balemorale
tags: balemorale, lady laidronette cavendish, security plushies, quest, rewards
*/
// Port of Scripts/Other/SecurityPlushiesQuestReward.cs.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class SecurityPlushiesQuestRewards {
    getRewards(QuestID = 9731): void {
        const RewardOptions = Core.ensureLoad(QuestID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                // C# returns here, so the rewards after the first one you own were never farmed.
                continue;
            }

            Core.logger(
                Core.checkInventory(Reward.id, undefined, { toInv: false })
                    ? `${Reward.name}: ✅`
                    : `${Reward.name} ❌`,
            );

            Core.registerQuests(QuestID);
            Core.farmingLogger(Reward.name, 1);
            while (!bot.shouldExit && !Core.checkInventory(Reward.id)) {
                Core.huntMonster("midnightzone", "Vowed ShadowSlayer", "Nightmare-Resistant Thread", 10, {
                    log: false,
                });
            }
            Core.cancelRegisteredQuests();

            Core.jumpWait();
            Core.toBank(Reward.name);
        }
    }
}

export default function main(): void {
    const script = new SecurityPlushiesQuestRewards();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
