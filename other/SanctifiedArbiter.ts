/*
name: Sanctified Arbiter Set
description: Farms "All Drops" From Quest: "One Holy Discovery".
tags: sanctified arbiter, drops, one holy discovery
*/
// Port of Scripts/Other/SanctifiedArbiter.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();

export class SanctifiedArbiter {
    getAll(): void {
        const RewardOptions = Core.ensureLoad(8114).rewards;
        const RewardList = RewardOptions.map((x) => x.name);
        const Rewards = [...RewardList];

        if (Core.checkInventory(Rewards)) {
            return;
        }

        for (let i = 0; i < Rewards.length; i++) {
            if (!Core.checkInventory(Rewards[i])) {
                Core.logger(`Getting "${Rewards[i]}"`);
                //One Holy Discovery 8114
                Core.ensureAccept(8114);

                Core.equipClass(ClassType.Farm);
                Farm.battleUnderB("Bone Dust", 500);
                Core.huntMonster("Doomwood", "Doomwood Ectomancer", "Raw Essence of the Undead", 10);

                Core.ensureCompleteChoose(8114, [Rewards[i]]);
            }
            Core.toBank(Rewards[i]);
        }
    }
}

export default function main(): void {
    const script = new SanctifiedArbiter();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
