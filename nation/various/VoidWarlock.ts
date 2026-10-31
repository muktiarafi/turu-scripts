/*
name: Void Warlock
description: This script farms the Void Warlock set from the [Tools for the Job] and [Corrupted Touch] quests
tags: void, warlock, tools, job, corrupted, touch, quest, rewards, tools for the job, corrupted touch, voidwarlock
*/
// Port of Scripts/Nation/Various/VoidWarlock.cs.

import { bot } from "turu";
import { Core, type RewardItem } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";
import { EnhancedNulgathNationHouse } from "./EnchantedNulgathNationHouse";

const Nation = new CoreNation();
const ENNH = new EnhancedNulgathNationHouse();

export class VoidWarlock {
    getWarlock(singleToolReward: string | null = null, singleTouchReward: string | null = null): void {
        const LoadRewards = (questID: number, singleReward: string | null): RewardItem[] => {
            const rewards = Core.ensureLoad(questID).rewards;
            return singleReward == null ? rewards : rewards.filter((r) => r.name === singleReward);
        };
        // Required to Accept/turn in Quest:
        ENNH.getENNH();

        // Load rewards for both quests (6683 - Tools, 6684 - Touch)

        const ToolsRewards = LoadRewards(6683, singleToolReward);
        const TouchRewards = LoadRewards(6684, singleTouchReward);

        // Add items to drop
        [...ToolsRewards, ...TouchRewards].forEach((item) => bot.drops.add(item.name));

        bot.drops.add(...Nation.bagDrops.concat("Brittney's Winter Diamond"));

        // Handle [Tools for the Job] Quest
        Core.logger("Starting [Tools for the Job] Quest");
        for (const reward of ToolsRewards) {
            if (Core.checkInventory(reward.id, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(reward.name, 1);
            Core.ensureAccept(6683);
            Core.huntMonster("northlands", "Aisha's Drake", "Brittney's Winter Diamond", 1, { isTemp: false });
            Nation.farmUni13(2);
            Nation.farmVoucher({ member: false });
            Nation.farmBloodGem(90);
            Nation.farmTaintedGem(100);
            Core.ensureComplete(6683, reward.id);
            bot.wait.forQuestComplete(6683);
            Core.toBank(reward.id);
        }
        Core.logger("All drops acquired from [Tools for the Job] Quest");

        // Handle [Corrupted Touch] Quest
        Core.logger("Starting [Corrupted Touch] Quest");
        for (const reward of TouchRewards) {
            if (Core.checkInventory(reward.id, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(reward.name, 1);
            Core.ensureAccept(6684);
            Nation.farmUni13(1);
            Nation.farmVoucher({ member: true });
            Nation.farmDiamondofNulgath(75);
            Nation.farmGemofNulgath(100);
            Nation.farmTaintedGem(75);
            Nation.approvalAndFavor(1000, 0);
            Core.huntMonster("northlands", "Aisha's Drake", "Brittney's Winter Diamond", 1, { isTemp: false });
            Core.ensureComplete(6684, reward.id);
            bot.wait.forQuestComplete(6684);
            Core.toBank(reward.id);
        }
        Core.logger("All drops acquired from [Corrupted Touch] Quest");
    }
}

export default function main(): void {
    const script = new VoidWarlock();
    Core.setOptions();

    script.getWarlock();

    Core.setOptions(false);
}
