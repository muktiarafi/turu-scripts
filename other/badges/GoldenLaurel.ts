/*
name: GoldenLaurel
description: null
tags: null
*/
// Port of Scripts/Other/Badges/GoldenLaurel.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { GoldenArena } from "../../story/queenofmonsters/extra/GoldenArena";

const GA = new GoldenArena();

export class GoldenLaurel {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Golden Arena story for ${this.badgeName} badge`);
        GA.storyLine();
    }

    private readonly badgeName = "Golden Laurel";
}

export default function main(): void {
    const script = new GoldenLaurel();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
