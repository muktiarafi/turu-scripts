/*
name: SkyPirateSlayerBadge
description: null
tags: null
*/
// Port of Scripts/Other/Badges/SkyPirateSlayerBadge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { ClassType, Core } from "../../core/CoreBots";
import { SkyGuardSaga } from "../../story/SkyGuardSaga";

const skyGuardSaga = new SkyGuardSaga();

export class SkyPirateBadge {
    badge(): void {
        if (!Core.isMember) {
            return;
        }

        if (Core.hasWebBadge("SkyPirate Slayer")) {
            Core.logger("Already have the SkyPirate Slayer badge");
            return;
        }

        skyGuardSaga.doAll();

        Core.addDrop("SkyPirate Annhilator Recognition");
        Core.equipClass(ClassType.Farm);

        Core.ensureAccept(1291);
        Core.killMonster("strategy", "r22", "Left", "*", "SkyPirate Annihilator Token", 100, { log: false });
        Core.ensureComplete(1291);

        Core.jumpWait();
    }
}

export default function main(): void {
    const script = new SkyPirateBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
