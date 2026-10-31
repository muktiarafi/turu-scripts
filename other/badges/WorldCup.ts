/*
name: WorldCup
description: aquires the `world cup` badge from /goal
tags: WorldCup, badge
*/
// Port of Scripts/Other/Badges/WorldCup.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class WorldCup {
    badge(): void {
        // Bot.Options.LagKiller = false;
        if (Core.hasWebBadge(this.badgeName) || !Core.isSeasonalMapActive("goal")) {
            Core.logger(`Already have the ${this.badgeName} badge, or the map is not available.`);
            return;
        }

        Core.ensureAccept(10774);
        Core.join("goal-100000");
        bot.map.getMapItem(15884);
        bot.wait.forTrue(() => bot.tempInv.contains(45254), 20);
        Core.ensureComplete(10774);
    }

    private readonly badgeName = "World Cup";
}

export default function main(): void {
    const script = new WorldCup();
    Core.setOptions();

    script.badge();

    Core.setOptions(false);
}
