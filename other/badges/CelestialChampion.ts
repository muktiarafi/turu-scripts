/*
name: (Badge) Celestial Champion
description: This will get the Celestial Champion badge.
tags: badge, celestial, arena, champion
*/
// Port of Scripts/Other/Badges/CelestialChampion.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CelestialArenaQuests } from "../../story/queenofmonsters/extra/CelestialArena";

const CA = new CelestialArenaQuests();

export class CelestialArenaChampion {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Celestial Arena Challenge for ${this.badgeName} badge`);
        CA.arena1to10();
        CA.arena11to20();
        CA.arena21to29();
    }

    private readonly badgeName = "Celestial Champion";
}

export default function main(): void {
    const script = new CelestialArenaChampion();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
