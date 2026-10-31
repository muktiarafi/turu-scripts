/*
name: Battle Bunny Plushies
description: This will finish the Cheep Chase quest to obtain the Battle Bunny Plushies.
tags: battle-bunny-plushies, seasonal, easter,battle bunny,plushie,plushies,battle bunny plushie,valencia,grenwog
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/BattleBunnyPlushies.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class BattleBunnyPlushies {
    getBBP(): void {
        if (Core.checkInventory(Core.questRewards(10202)) || !Core.isSeasonalMapActive("grenwog")) {
            return;
        }

        Core.addDrop(...Core.questRewards(10202));

        // Cheep Chase [10202]
        Core.ensureAccept(10202);
        Core.getMapItem(14388, undefined, "swordhavenbridge");
        Core.getMapItem(14389, undefined, "deathgazer");
        Core.getMapItem(14390, undefined, "somnia");
        Core.getMapItem(14391, undefined, "siegefortress");
        Core.ensureComplete(10202);
    }
}

export default function main(): void {
    const script = new BattleBunnyPlushies();
    Core.setOptions();

    script.getBBP();

    Core.setOptions(false);
}
