/*
name: Tinsel Quest Rewards
description: This script will farm "Gift Theft?! NOT COOL." [8177] quest rewards.
tags: tinsel, quest, rewards, bright lights, festive, ushanka, party, seasonal, frostval, july
*/
// Port of Scripts/Seasonal/FrostvalInJuly/TinselQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class TinselQuestRewards {
    autoReward(questID = 0): void {
        const RewardOptions = Core.ensureLoad(questID).rewards;

        bot.drops.add(...Core.questRewards(questID));

        for (const item of RewardOptions) {
            while (!bot.shouldExit && !Core.checkInventory(item.id)) {
                Core.ensureAccept(questID);
                Core.huntMonster("brightlights", "Snow Golem", "Cool Gift", undefined, { log: false });
                Core.ensureComplete(questID, item.id);
            }
        }
    }
}

export default function main(): void {
    const script = new TinselQuestRewards();
    Core.setOptions();

    //Gift Theft?! NOT COOL.
    script.autoReward(8177);

    Core.setOptions(true);
}
