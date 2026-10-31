/*
name: LootTheUndresser Quest Rewards
description: farms quest rewards from 'Loot the UnDresser` in /cursedshop
tags: loottheundresser, quest reward, cursed antique shop, cursed bust
*/
// Port of Scripts/Seasonal/AqwBirthday/LootTheUndresserRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const TOD = new CoreToD();

export class LootTheUndresser {
    getRewards(): void {
        TOD.antiqueShop();

        const RewardOptions = Core.ensureLoad(5435).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.id);
        }

        Core.equipClass(ClassType.Farm);
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} obtained.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
            }

            while (!bot.shouldExit && !Core.checkInventory(Reward.name)) {
                Core.ensureAccept(5435);
                Core.huntMonster("cursedshop", "UnDresser", "Dressered Down", undefined, { log: false });
                Core.ensureComplete(5435, Reward.id);
                Core.toBank(Reward.id);
            }
        }
        Core.logger("all rewards gathered.");
    }
}

export default function main(): void {
    const script = new LootTheUndresser();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
