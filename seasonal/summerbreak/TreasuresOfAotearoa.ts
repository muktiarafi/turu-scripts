/*
name: Treasures of Aotearoa
description: This script will farm all the rewards of "Treasures of Aotearoa" quest.
tags: treasures, of, aotearoa, seasonal, summer, break, valencia, dandelion, kiwi, cookie
*/
// Port of Scripts/Seasonal/SummerBreak/TreasuresOfAotearoa.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class TreasuresOfAotearoa {
    questID = 9279;

    rewards(): void {
        Core.addDrop(...Core.questRewards(this.questID));

        Core.equipClass(ClassType.Farm);
        for (const Item of Core.questRewards(this.questID).slice(4, 9)) {
            if (Core.checkInventory(Item, undefined, { toInv: false })) {
                Core.logger(`${Item} Found.`);
            } else {
                const rewards = Core.ensureLoad(this.questID).rewards;
                const item = rewards.find((x) => x.name === Item);

                Core.ensureAccept(this.questID);

                Core.huntMonster("burningbeach", "Water Goblin", "Stolen Egg", 5, { log: false });

                Core.ensureComplete(this.questID, item?.id); // C# `?? default` (0); the port's default is -1, also no choice
            }
        }

        Core.registerQuests(this.questID);
        while (!bot.shouldExit && !Core.checkInventory(Core.questRewards(this.questID).slice(2, 3))) {
            Core.huntMonster("burningbeach", "Water Goblin", "Stolen Egg", 5, { log: false });
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new TreasuresOfAotearoa();
    Core.setOptions();

    script.rewards();

    Core.setOptions(true);
}
