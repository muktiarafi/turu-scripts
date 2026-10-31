/*
name: StoryARC
description: null
tags: null
*/
// Port of Scripts/Other/Badges/StoryARC.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDoomwood } from "../../story/doomwood/CoreDoomwood";

const DW = new CoreDoomwood();

export class StoryArcBadge {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Doomwood Part 1 story for ${this.badgeName} badge`);
        DW.doomwoodPart1();
    }

    private readonly badgeName = "Story ARC";
}

export default function main(): void {
    const script = new StoryArcBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
