/*
name: LordOfTheWeddingRing
description: null
tags: null
*/
// Port of Scripts/Other/Badges/LordOfTheWeddingRing.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { ArtixWedding } from "../../story/ArtixWedding";

const AW = new ArtixWedding();

export class LordOfTheWeddingRing {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Artix Wedding story for ${this.badgeName} badge`);
        AW.artixWeddingComplete();
    }

    private readonly badgeName = "Lord of the Wedding Ring";
}

export default function main(): void {
    const script = new LordOfTheWeddingRing();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
