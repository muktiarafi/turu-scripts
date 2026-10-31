/*
name: Mockingbird Quest Rewards
description: farms quest rewards from `Mockingbird` in /holidayhotel
tags: holidayhotel, aria, quest rewards,frostvale,mockingbird
*/
// Port of Scripts/Seasonal/Frostvale/Mockingbird.cs.

import { ClassType, Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Frost = new CoreFrostvale();

export class Mockingbird {
    questID = 10004;

    getRewards(): void {
        Frost.holidayHotel();

        const RewardOptions = Core.ensureLoad(this.questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                // C# returns here, so the rewards after the first one you own were never farmed.
                continue;
            }

            Core.farmingLogger(Reward.name, 1);

            Core.ensureAccept(this.questID);
            Core.equipClass(ClassType.Farm);
            Core.huntMonster("holidayhotel", "Hotel Guest", "Guest's Ornament", 10, { log: false });
            Core.huntMonster("holidayhotel", "Cold Apparition", "Apparition's Eye", 10, { log: false });
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("holidayhotel", "Memory Leech", "Stolen Memory", undefined, { log: false });

            Core.ensureComplete(this.questID, Reward.id);
            Core.jumpWait();
            Core.toBank(Reward.name);
        }
    }
}

export default function main(): void {
    const script = new Mockingbird();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
