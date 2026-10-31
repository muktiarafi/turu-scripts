/*
name: Mmmm, Meaty Quest Rewards
description: This will obtain all of the Quest Rewards.
tags: mmmm-meaty-quest, seasonal, april-fools
*/
// Port of Scripts/Seasonal/AprilFools/Mmmm,Meaty(or)(MeatyShard).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class MmmmMeatyQuest {
    completeQuests(): void {
        if (!Core.isSeasonalMapActive("MeateorTown")) {
            return;
        }
        const RewardOptions = Core.ensureLoad(8613).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }

        const Rewards = [...RewardsList];

        Core.addDrop(...Rewards);
        Core.addDrop("Meaty Shard", "Meateor Shard");

        Core.equipClass(ClassType.Solo);

        if (!Story.questProgression(8612)) {
            Core.ensureAccept(8612);
            Core.killMonster("MeateorTown", "r9", "Right", "Giant ChickenCow", "ChickenCow Tamed", undefined, {
                publicRoom: true,
            });
            Core.ensureComplete(8612);
        }

        while (!bot.shouldExit && !Core.checkInventory(Rewards)) {
            Core.ensureAccept(8613);
            Core.killMonster("MeateorTown", "r9", "Right", "Giant ChickenCow", "Meaty Shard", undefined, {
                publicRoom: true,
            });
            Core.ensureComplete(8613);
            bot.wait.forPickup("*");
        }
    }
}

export default function main(): void {
    const script = new MmmmMeatyQuest();
    Core.bankingBlackList.push("Meaty Shard");

    Core.setOptions();

    script.completeQuests();

    Core.setOptions(false);
}
