/*
name: YouChuteYouScore
description: does the `You Chute, You Score` badge
tags: YouChuteYouScore, You Chute You Score
*/
// Port of Scripts/Other/Badges/YouChuteYouScore.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class YouChuteYouScoreBadge {
    badge(): void {
        if (Core.hasWebBadge(this.badgeName)) {
            Core.logger(`Already have the ${this.badgeName} badge`);
            return;
        }

        Core.logger(`Kicking some balls for the ${this.badgeName}`);
        Core.join("chute");
        Core.ensureAccept(8543);
        bot.map.getMapItem(9837);
        Core.sleep();
        Core.ensureComplete(8543);
    }

    private badgeName = "You /Chute, You Score";
}

export default function main(): void {
    const script = new YouChuteYouScoreBadge();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
