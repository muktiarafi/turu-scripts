/*
name: World Savior & Frost Defanged Badge
description: This will finish the required quest in order to get the badge.
tags: frost-defanged-badge, world-savior-badge, frostvale, seasonal
*/
// Port of Scripts/Seasonal/Frostvale/FrostvaleBadges.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFrostvale } from "./story/CoreFrostvale";

const Frostvale = new CoreFrostvale();

export class FrostvaleBadges {
    badges(): void {
        if (Core.hasWebBadge(this.badge1) && Core.hasWebBadge(this.badge2)) {
            Core.logger(`Already have the Frostvale badges`);
            return;
        }

        if (!Core.hasWebBadge(this.badge1)) {
            Core.logger('World Savior: Reward from; "Face Kezeroth" Quest.');
        }

        if (!Core.hasWebBadge(this.badge2)) {
            Core.logger('Frost Defanged: Reward from; "Defeat Frostfang (Evil/Good)" ');
        }

        Core.logger("Doing Frostvale story for badges");
        Frostvale.doAll();
    }

    private readonly badge1 = "World Savior";
    private readonly badge2 = "Frost Defanged";
}

export default function main(): void {
    const script = new FrostvaleBadges();
    Core.setOptions();

    script.badges();

    Core.setOptions(false);
}
