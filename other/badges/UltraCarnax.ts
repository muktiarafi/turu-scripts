/*
name: UltraCarnax
description: null
tags: null
*/
// Port of Scripts/Other/Badges/UltraCarnax.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreStory } from "../../core/CoreStory";

const Story = new CoreStory();

export class UltraCarnaxBadge {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        if (!Core.isMember) {
            Core.logger("You are not a member!");
            return;
        }

        Core.logger(`Doing UltraCarnax story for ${this.badgeName} badge`);
        // Ultra Carnax Challenge Fight! 2388
        Story.killQuest(2388, "ultracarnax", "Ultra-Carnax");
    }

    private readonly badgeName = "Ultra-Carnax";
}

export default function main(): void {
    const script = new UltraCarnaxBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
