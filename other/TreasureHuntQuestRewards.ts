/*
name: Treasure Hunt Quest Rewards
description: This script will get the rewards from the Treasure Hunt Quest.
tags: treasure, hunt, quest, rewards, draco con, bob macguffin, spiked slayer mace, drakka defender
*/
// Port of Scripts/Other/TreasureHuntQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { DracoCon } from "../story/DracoCon";

const DR = new DracoCon();

export class TreasureHuntQuest {
    doQuest(CBoA = false): void {
        DR.storyLine();
        this.treasureHuntRewards(undefined, CBoA);
    }

    treasureHuntRewards(questID = 5373, CBoA = false): void {
        if (CBoA && Core.checkInventory("Spiked Slayer Mace")) {
            return;
        }

        const RewardOptions = CBoA
            ? Core.ensureLoad(questID).rewards.filter((x) => x.name === "Spiked Slayer Mace")
            : Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        Core.equipClass(ClassType.Farm);
        Core.registerQuests(questID);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("dracocon", "Treasure Pile", "Treasure Searched", undefined, { log: false });
                }
            }
        }
    }
}

export default function main(): void {
    const script = new TreasureHuntQuest();
    Core.setOptions();

    script.doQuest();
    script.treasureHuntRewards();

    Core.setOptions(true);
}
