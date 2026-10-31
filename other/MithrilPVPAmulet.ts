/*
name: Mithril PvP Amulet
description: Farms "Mithril PvP Amulet" From Mob: "Reaper".
tags: mitril pvp amulet, diamoind pvp amulet, pvp, amulet
*/
// Port of Scripts/Other/MithrilPVPAmulet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";

export class MitrilPvPAmulet {
    getAmulet(): void {
        if (Core.checkInventory(59667)) {
            return;
        }

        Core.huntMonster("thevoid", "Reaper", "Diamond PvP Amulet +5500", undefined, { isTemp: false });
        Core.huntMonster("thevoid", "Reaper", "Platinum PvP Amulet +5000", undefined, { isTemp: false });

        Core.buyItem(bot.map.name, 222, "Mithril PvP Amulet +15000");
    }
}

export default function main(): void {
    const script = new MitrilPvPAmulet();
    Core.setOptions();

    script.getAmulet();

    Core.setOptions(false);
}
