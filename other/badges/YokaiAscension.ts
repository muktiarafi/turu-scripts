/*
name: Yokai Ascension Badge
description: This will get the Yokai Ascension badge.
tags: badge, yokai, ascension, dragons, dragons of yokai, yokai realm
*/
// Port of Scripts/Other/Badges/YokaiAscension.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDOY } from "../../story/dragonsofyokai/CoreDOY";

const DOY = new CoreDOY();

export class YokaiAscension {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Doing Yokai Realm story for ${this.badgeName} badge`);

        DOY.yokaiRealm();
    }

    private readonly badgeName = "Yokai Ascension";
}

export default function main(): void {
    const script = new YokaiAscension();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
