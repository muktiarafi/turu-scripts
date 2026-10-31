/*
name: HordeZombieSLAYER
description: null
tags: null
*/
// Port of Scripts/Other/Badges/HordeZombieSLAYER.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";

export class HordeZombieSLAYER {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing quest for ${this.badgeName} badge`);

        Core.equipClass(ClassType.Farm);

        Core.ensureAccept(8670);
        Core.killMonster("darkoviahorde", "r8", "Right", "*", "Zombie Defeated", 100, { log: false });
        Core.ensureComplete(8670);
    }

    private readonly badgeName = "Zombie Slayer";
}

export default function main(): void {
    const script = new HordeZombieSLAYER();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
