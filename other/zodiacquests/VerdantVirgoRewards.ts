/*
name: Verdant Virgo Rewards
description: farms quest rewards from Verdant Virgo` in /arcangrove
tags: quest reward, kylokos, verdant, virgo, arcangrove, zodiac
*/
// Port of Scripts/Other/ZodiacQuests/VerdantVirgoRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class VerdantVirgo {
    getRewards(): void {
        if (Core.checkInventory(Core.questRewards(9197))) {
            return;
        }

        const RewardOptions = Core.ensureLoad(9197).rewards;

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
                Core.ensureAccept(9197);
                Core.huntMonster("underglade", "Forest Spirit", "Forest Star Shard", 50, { isTemp: false, log: false });
                Core.huntMonster("underglade", "Tree Nymph", "Maiden's Star Shard", 50, { isTemp: false, log: false });
                Core.ensureComplete(9197, Reward.id);
                Core.toBank(Reward.id);
            }
        }
        Core.logger("all rewards gathered.");
    }
}

export default function main(): void {
    const script = new VerdantVirgo();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
