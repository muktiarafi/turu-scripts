/*
name: RGRoW Badge
description: null
tags: null
*/
// Port of Scripts/Other/Badges/RgrowBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";

export class RGRoWBadge {
    getRGRoWBadge(): void {
        if (Core.hasWebBadge(this.badge)) {
            Core.logger(`Already have the ${this.badge} badge`);
            return;
        }
        if (!Core.checkInventory("Radiant Goddess of War")) {
            Core.logger('Missing "Radiant Goddess of War", Cannot get badge', undefined, {
                stopBot: true,
                messageBox: true,
            });
        }

        Core.ensureAccept(9352);
        // 9352 | Radiant Goddess of War Badge
        Core.equipClass(ClassType.Solo);
        Core.killMonster("manacradle", "r10", "Left", "The Mainyu", "Licorice Scale");
        Core.ensureComplete(9352);
    }

    private readonly badge = "Radiant Goddess Of War";
}

export default function main(): void {
    const script = new RGRoWBadge();
    Core.setOptions();

    script.getRGRoWBadge();
    Core.setOptions(false);
}
