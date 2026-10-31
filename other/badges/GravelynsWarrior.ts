/*
name: Gravelyn's Warrior Badge
description: Kills 100 skeletons to get you the Gravelyn's Warrior Badge
tags: gravelyn, warrior, badge, skeletons, shadowfall
*/
// Port of Scripts/Other/Badges/GravelynsWarrior.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class GravelynsWarrior {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName) || Core.isCompletedBefore(8671)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.ensureAccept(8671);
        Core.killMonster("shadowfall", "New6", "Left", "*", "Skeleton Defeated", 100);
        Core.ensureComplete(8671);
    }

    private readonly badgeName = "Gravelyn's Warrior";
}

export default function main(): void {
    const script = new GravelynsWarrior();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
