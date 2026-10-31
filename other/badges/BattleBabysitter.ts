/*
name: (Badge) Battle Babysitter
description: This will get the Battle Babysitter badge.
tags: badge, doomwood, battle, baby-sitter
*/
// Port of Scripts/Other/Badges/BattleBabysitter.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDoomwood } from "../../story/doomwood/CoreDoomwood";

const Doomwood = new CoreDoomwood();

export class BattleBabysitter {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Doomwood story for ${this.badgeName} badge`);
        Doomwood.doomwoodPart3();
    }

    private readonly badgeName = "Battle Babysitter";
}

export default function main(): void {
    const script = new BattleBabysitter();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
