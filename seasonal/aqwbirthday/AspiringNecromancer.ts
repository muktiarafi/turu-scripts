/*
name: Aspiring Necromancer Rewards
description: This will do the 3 Aspiring Necromancer quest and obtain all of the rewards.
tags: aspiring-necromancer, aqw-anniversary, seasonal
*/
// Port of Scripts/Seasonal/AqwBirthday/AspiringNecromancer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class AspiringNecromancer {
    example(): void {
        const Quest1Rewards = Core.ensureLoad(7751).rewards.map((i) => i.name);
        const Quest2Rewards = Core.ensureLoad(7752).rewards.map((i) => i.name);
        const Quest3Rewards = Core.ensureLoad(7753).rewards.map((i) => i.name);
        const AllRewards = [...Quest1Rewards, ...[...Quest2Rewards, ...Quest3Rewards]];

        if (Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            return;
        }

        bot.drops.add(...AllRewards);

        //I Want to Be The Very Best Necromancer 7751
        Core.registerQuests(7751);
        while (!bot.shouldExit && !Core.checkInventory(Quest1Rewards, undefined, { toInv: false })) {
            Core.huntMonster("BattleunderA", "Skeletal Warrior", "Skeleton Captured", 10, { log: false });
        }
        Core.jumpWait();
        Core.cancelRegisteredQuests();
        Core.toBank(...AllRewards);

        //Like No One Ever Was 7752
        Core.registerQuests(7752);
        while (!bot.shouldExit && !Core.checkInventory(Quest2Rewards, undefined, { toInv: false })) {
            Core.huntMonster("DoomWood", "Doomwood Bonemuncher", "Bones Collected", 15, { log: false });
        }
        Core.jumpWait();
        Core.cancelRegisteredQuests();
        Core.toBank(...AllRewards);

        bot.quests.updateQuest(2060);
        bot.quests.updateQuest(3019);
        //To Raise Them is my Real Quest 7753
        Core.registerQuests(7753);
        while (!bot.shouldExit && !Core.checkInventory(Quest3Rewards, undefined, { toInv: false })) {
            Core.huntMonsterMapID("necrodungeon", 46, "Dracolich Head");
            Core.huntMonsterMapID("necrodungeon", 47, "Yet Another Dracolich Head");
            Core.huntMonsterMapID("necrodungeon", 49, "More Dracolich Heads");
            Core.huntMonster("underrealm", "Agony", "Fresh Agony Wraps", 5, { log: false });
        }
        Core.jumpWait();
        Core.cancelRegisteredQuests();
        Core.toBank(...AllRewards);
    }
}

export default function main(): void {
    const script = new AspiringNecromancer();
    Core.setOptions();

    script.example();

    Core.setOptions(false);
}
