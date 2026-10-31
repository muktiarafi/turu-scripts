/*
name: Pisces Venaris Mater Rewards
description: farms quest rewards from Pisces Venaris Mater` in /arcangrove
tags: quest reward, kylokos, pisces, venaris, mater, arcangrove, zodiac
*/
// Port of Scripts/Other/ZodiacQuests/PiscesVenarisMaterRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class PiscesVenarisMater {
    getRewards(): void {
        if (Core.checkInventory(Core.questRewards(9145))) {
            return;
        }

        const RewardOptions = Core.ensureLoad(9145).rewards;

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
                Core.ensureAccept(9145);
                Core.killMonster("natatorium", "r2", "Left", "Anglerfish", "Anglerfish Star Shard", 10, {
                    isTemp: false,
                    log: false,
                });
                Core.killMonster("natatorium", "r3", "Left", "Merdraconian", "Merdraconian Star Shard", 10, {
                    isTemp: false,
                    log: false,
                });
                Core.ensureComplete(9145, Reward.id);
                Core.toBank(Reward.id);
            }
        }
        Core.logger("all rewards gathered.");
    }
}

export default function main(): void {
    const script = new PiscesVenarisMater();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
