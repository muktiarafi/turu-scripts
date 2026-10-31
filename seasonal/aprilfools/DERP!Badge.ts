/*
name: DERP! Badge
description: This will get the DERP! Badge.
tags: derp, badge, seasonal, april-fools
*/
// Port of Scripts/Seasonal/AprilFools/DERP!Badge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class DERPBadge {
    getBadge(): void {
        //Progress Check
        if (Core.isCompletedBefore(8007)) {
            return;
        }
        if (!Core.isSeasonalMapActive("gardenquest")) {
            return;
        }

        Core.addDrop("Rainbow Derpicorn Guard (L)", "Rainbow Derpicorn Guard (R)");
        Core.logger('Hunting For Item: "Rainbow Derpicorn Guard(R)"');
        while (!bot.shouldExit && !bot.house.contains("Rainbow Derpicorn Guard (R)")) {
            Core.huntMonster("battlefools", "Rainbow Derpicorn", undefined, undefined, { log: false });
        }

        Core.ensureAccept(8007);
        Core.huntMonster("gardenquest", "Sketchy Chickencow", "Sketchy Chickencow Slain");
        Core.ensureComplete(8007);
    }
}

export default function main(): void {
    const script = new DERPBadge();
    Core.setOptions();

    script.getBadge();

    Core.setOptions(false);
}
