/*
name: Harmonic Savant Rewards
description: farms quest rewards from Harmonic Savant` in /arcangrove
tags: quest reward, kylokos, harmonic, savant, harmonic libra, libra, arcangrove, zodiac
*/
// Port of Scripts/Other/ZodiacQuests/HarmonicSavantRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class HarmonicSavant {
    getRewards(): void {
        if (Core.checkInventory(Core.questRewards(9198))) {
            return;
        }

        const RewardOptions = Core.ensureLoad(9198).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.id);
        }
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} obtained.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
            }

            while (!bot.shouldExit && !Core.checkInventory(Reward.name)) {
                Core.ensureAccept(9198);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("skytower", "Aspect of Good", "Good Star Shard", 1, { isTemp: false, log: false });
                Core.huntMonster("skytower", "Aspect of Evil", "Evil Star Shard", 1, { isTemp: false, log: false });
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("astraviajudge", "Juror", "Judgement Star Shard", 25, { isTemp: false, log: false });
                Core.ensureComplete(9198, Reward.id);
                Core.toBank(Reward.id);
            }
        }
        Core.logger("all rewards gathered.");
    }
}

export default function main(): void {
    const script = new HarmonicSavant();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
