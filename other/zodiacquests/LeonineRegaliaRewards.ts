/*
name: Leonine Regalia Rewards
description: farms quest rewards from Leonine Regalia in /arcangrove
tags: quest reward, kylokos, leonineregalia, leonine, regalia, arcangrove, zodiac
*/
// Port of Scripts/Other/ZodiacQuests/LeonineRegaliaRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class LeonineRegalia {
    getRewards(): void {
        if (Core.checkInventory(Core.questRewards(9196))) {
            return;
        }

        const RewardOptions = Core.ensureLoad(9196).rewards;

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
                Core.ensureAccept(9196);
                Core.huntMonster("onslaughttower", "Golden Caster", "Burning Star Shard", 25, {
                    isTemp: false,
                    log: false,
                });
                Core.huntMonster("onslaughttower", "Maximillian Lionfang", "Regal Star Shard", 1, {
                    isTemp: false,
                    log: false,
                });
                Core.ensureComplete(9196, Reward.id);
                Core.toBank(Reward.id);
            }
        }
        Core.logger("All rewards gathered.");
    }
}

export default function main(): void {
    const script = new LeonineRegalia();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
