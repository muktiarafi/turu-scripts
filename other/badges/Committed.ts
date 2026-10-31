/*
name: Committed
description: null
tags: null
*/
// Port of Scripts/Other/Badges/Committed.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Asylum } from "../../story/Asylum";

const asylum = new Asylum();

export class Committed {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Asylum story for ${this.badgeName} badge`);
        asylum.storyLine();
    }

    private readonly badgeName = "Committed";
}

export default function main(): void {
    const script = new Committed();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
