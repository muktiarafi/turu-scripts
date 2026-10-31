/*
name: 6thBirthdaySavior
description: null
tags: null
*/
// Port of Scripts/Other/Badges/6thBirthdaySavior.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Artixpointe } from "../../story/Artixpointe";

const AP = new Artixpointe();

export class BirthdaySavior {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Artixpointe story for ${this.badgeName} badge`);
        AP.omniArtifact();
    }

    private readonly badgeName = "6th Birthday Savior";
}

export default function main(): void {
    const script = new BirthdaySavior();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
