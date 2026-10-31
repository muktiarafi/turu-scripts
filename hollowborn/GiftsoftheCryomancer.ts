/*
name: Gifts of the Cryomancer
description: This script will farm all the rewards from the quest "Gifts of the Cryomancer"
tags: gifts of the cryomancer, staff, bithday
*/
// Port of Scripts/Hollowborn/GiftsoftheCryomancer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class GiftsoftheCryomancer {
    getRewards(): void {
        if (Core.checkInventory(Core.questRewards(9589), undefined, { toInv: false })) {
            Core.logger("All Rewards Obtained.");
            return;
        }

        bot.drops.add(...Core.questRewards(9589));
        Core.registerQuests(9589);
        while (!bot.shouldExit && !Core.checkInventory(Core.questRewards(9589), undefined, { toInv: false })) {
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("shadowrealm", "Shadow Lord", "ShadowLord's Aura");
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("icedungeon", "Ice Crystal", "Ice Crystal Shard", 10);
            Core.toBank(...Core.questRewards(9589));
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new GiftsoftheCryomancer();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
