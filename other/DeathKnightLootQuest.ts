/*
name: DeathKnightLootQuest
description: This script will farm everything in DeathKnightLootChestQuest id: 6509 in /ivoliss
tags: death, knight, loot, chest, fallendeathknight, accoutrements
*/
// Port of Scripts/Other/DeathKnightLootQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { AranxQuests } from "../story/AranxQuests";

const AR = new AranxQuests();

export class DeathKnightLootChestQuest {
    doQuest(): void {
        this.questsIfNeeded();
    }

    randomReward(questID = 6509): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        Core.equipClass(ClassType.Solo);
        Core.registerQuests(questID);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("ivoliss", "ivoliss", "Loot Key", 6, { isTemp: true, log: false });
                }
            }
        }
    }

    questsIfNeeded(): void {
        AR.storyLine();
    }

    requiredItems(...items: string[]): void {
        if (Core.checkInventory(items) || items == null) {
            return;
        } else {
            Core.logger("Required Items not found, Stopping", undefined, { stopBot: true });
        }
    }
}

export default function main(): void {
    const script = new DeathKnightLootChestQuest();
    Core.setOptions();

    script.doQuest();
    script.randomReward(6509);

    Core.setOptions(true);
}
