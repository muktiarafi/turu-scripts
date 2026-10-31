/*
name: Snowball Amberarms Drops
description: Farms "All Drops" From Quest: "Snowball Thinks You're the Best".
tags: snowball thinks you're the best, drops
*/
// Port of Scripts/Other/SnowballAmberarms.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class SnowballAmberarms {
    loot: string[] = ["TundraWyrm Hunter", "WyrmHunter's Cowl", "WyrmHunter's Claymore", "WyrmHunter Back Claymore"];

    snowball(): void {
        if (Core.checkInventory(this.loot) || !Core.checkInventory("Snowball Amberarms")) {
            return;
        }

        Core.addDrop(...this.loot);
        Core.equipClass(ClassType.Solo);
        Core.registerQuests(3508);
        while (!bot.shouldExit && !Core.checkInventory(this.loot)) {
            Core.huntMonster("bosschallenge", "Mutated Void Dragon", "Dread Talon", undefined, { isTemp: false });
            Core.huntMonster("towerofdoom6", "Dread Terror", "Dread Tooth", 20, { isTemp: false });
        }
    }
}

export default function main(): void {
    const script = new SnowballAmberarms();
    Core.setOptions();

    script.snowball();

    Core.setOptions(false);
}
