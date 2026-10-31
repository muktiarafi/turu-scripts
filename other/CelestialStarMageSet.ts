/*
name: celestial starmage set
description: farms the starmage set from "Star Light, Star Bright"
tags: starmage, set, star light, star bright
*/
// Port of Scripts/Other/CelestialStarMageSet.cs.

import { ClassType, Core } from "../core/CoreBots";
import { CoreSepulchure } from "../story/sepulchuresaga/CoreSepulchure";

const CoreSS = new CoreSepulchure();

export class CelestialStarMageSet {
    getSet(): void {
        CoreSS.shadowfallRise();
        const RewardOptions = Core.ensureLoad(6592).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Solo);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                // C# returns here, so the rewards after the first one you own were never farmed.
                continue;
            }
            Core.farmingLogger(Reward.name, 1);

            Core.ensureAccept(6592);
            Core.huntMonster("lumafortress", "Light Elemental", "Light Particles", 5, { log: false });
            Core.ensureComplete(6592, Reward.id);
            Core.jumpWait();
            Core.toBank(Reward.name);
        }
    }
}

export default function main(): void {
    const script = new CelestialStarMageSet();
    Core.setOptions();

    script.getSet();

    Core.setOptions(false);
}
