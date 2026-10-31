/*
name: DualChainSawKatanas
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/DualChainSawKatanas.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";

export class DualChainSawKatanas {
    getWep(): void {
        if (Core.checkInventory("Dual Chainsaw Katanas", undefined, { toInv: false })) {
            return;
        }

        Core.ensureAccept(8670);
        Core.equipClass(ClassType.Farm);
        Core.killMonster("darkoviahorde", "r8", "Right", "Zombie", "Zombie Defeated", 100);
        Core.ensureComplete(8670);
        Core.jumpWait();
        Core.sleep();
        Core.setAchievement(10);
        Core.sleep();
        Core.buyItem("Darkoviahorde", 1171, "Dual Chainsaw Katanas");
    }
}

export default function main(): void {
    const script = new DualChainSawKatanas();
    Core.setOptions();

    script.getWep();

    Core.setOptions(false);
}
