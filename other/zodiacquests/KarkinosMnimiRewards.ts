/*
name: Karkinos Mnimi Quest Rewards
description: This script will get the "Karkinos Mnimi" [9195] quest rewards in /arcangrove.
tags: karkinos, mnimi, quest rewards, arcangrove, zodiac, kylokos
*/
// Port of Scripts/Other/ZodiacQuests/KarkinosMnimiRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class KarkinosMnimi {
    doQuest(): void {
        this.autoReward();
    }

    autoReward(questID = 9195): void {
        if (Core.checkInventory(Core.questRewards(questID))) {
            return;
        }

        const RewardOptions = Core.ensureLoad(questID).rewards;

        bot.drops.add(...Core.questRewards(questID));
        Core.equipClass(ClassType.Farm);

        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id)) {
                Core.ensureAccept(questID);
                Core.huntMonster("palooza", "Rock Lobster", "Lobster Shard", 20, { isTemp: false, log: false });
                Core.ensureComplete(questID, item.id);
            }
        }
    }
}

export default function main(): void {
    const script = new KarkinosMnimi();
    Core.setOptions();

    script.doQuest();

    Core.setOptions(true);
}
