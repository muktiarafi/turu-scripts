/*
name: DerpMoosefishBadge
description: null
tags: null
*/
// Port of Scripts/Other/Badges/DerpMoosefishBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class DerpMoosefishBadge {
    badge(): void {
        if (Core.hasAchievement(14) || Core.hasWebBadge("Derp Moosefish")) {
            return;
        }

        Farm.fishingREP(11, true);
    }
}

export default function main(): void {
    const script = new DerpMoosefishBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
