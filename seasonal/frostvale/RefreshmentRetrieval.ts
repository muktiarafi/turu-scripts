/*
name: Refreshment Retrieval
description: This will obtain all of the reward items on Refreshment Retrieval quest.
tags: refreshment-retrieval, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/RefreshmentRetrieval.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class RefreshmentRetrieval {
    questID = 9029;
    quant = 1;

    randomReward(questID: number, quant: number): void {
        this.questPreReq();

        const RewardOptions = Core.ensureLoad(questID).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        Core.equipClass(ClassType.Farm);
        Core.registerQuests(questID);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.huntMonster("caroltown", "Frostval Deer", Reward.name);
            }
        }
    }

    questPreReq(): void {
        if (Core.isCompletedBefore(9028)) {
            return;
        }

        Core.addDrop("Red Ribbon");

        Core.equipClass(ClassType.Solo);
        Core.ensureAccept(9028);
        while (!bot.shouldExit && !bot.quests.canComplete(9028)) {
            Core.huntMonster("caroltown", "Frostval Tree");
        }
        Core.ensureComplete(9028);
    }
}

export default function main(): void {
    const script = new RefreshmentRetrieval();
    Core.setOptions();

    script.randomReward(script.questID, script.quant);

    Core.setOptions(false);
}
