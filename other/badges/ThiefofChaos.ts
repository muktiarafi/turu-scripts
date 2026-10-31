/*
name: ThiefofChaos
description: null
tags: null
*/
// Port of Scripts/Other/Badges/ThiefofChaos.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { MagicThief } from "../../story/MagicThief";

const MT = new MagicThief();

export class ThiefofChaosBadge {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Magic Thief story for ${this.badgeName} badge`);
        MT.storyline();
    }

    private readonly badgeName = "Thief of Chaos";
}

export default function main(): void {
    const script = new ThiefofChaosBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
