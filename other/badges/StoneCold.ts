/*
name: StoneCold
description: null
tags: null
*/
// Port of Scripts/Other/Badges/StoneCold.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDoomwood } from "../../story/doomwood/CoreDoomwood";

const DW = new CoreDoomwood();

export class StoneCold {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Temple story for ${this.badgeName} badge`);
        DW.templeOfTheLight();
    }

    private readonly badgeName = "Stone Cold";
}

export default function main(): void {
    const script = new StoneCold();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
