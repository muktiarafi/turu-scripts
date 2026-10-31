/*
name: Lorebowl
description: Kills the mob in /punt for its drops
tags: lorebowl, drops, punt, twilly
*/
// Port of Scripts/Other/LoreBowl.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class LoreBowl {
    loreBowlItems: string[] = [
        "Broncolich Pennant",
        "Chaos Pennant",
        "Cheer Lover",
        "Cheer Lover's Hair",
        "Cheer Lover's Locks",
        "Chieftains Pennant",
        "Corsairs Pennant",
        "Crows Pennant",
        "CyberHounds Pennant",
        "Diabolical Pennant",
        "Evil Pennant",
        "Good Pennant",
        "Harpies Pennant",
        "Hollowborn Pennant",
        "Hoofs Pennant",
        "Horcs Pennant",
        "Legion Pennant",
        "Loyalists Pennant",
        "Mammoths Pennant",
        "Miner Pennant",
        "Nation Pennant",
        "Saints Pennant",
        "Satyrs Pennant",
        "Tigers Pennant",
        "Void Nation Cheerleader",
    ];

    drops(): void {
        if (!Core.isSeasonalMapActive("punt") || Core.checkInventory(this.loreBowlItems, undefined, { toInv: false })) {
            return;
        }

        bot.drops.add(...this.loreBowlItems);
        Core.equipClass(ClassType.Solo);
        for (const item of this.loreBowlItems) {
            Core.farmingLogger(item, 1);
            while (!bot.shouldExit && !Core.checkInventory(item, undefined, { toInv: false })) {
                Core.killMonster("punt", "Enter", "Spawn", "Undead Defender", item, undefined, {
                    isTemp: false,
                    log: false,
                });
            }
            Core.toBank(...this.loreBowlItems);
        }
    }
}

export default function main(): void {
    const script = new LoreBowl();
    Core.setOptions();

    script.drops();

    Core.setOptions(false);
}
