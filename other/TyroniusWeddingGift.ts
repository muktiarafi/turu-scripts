/*
name: Tyronius Weddin gGift
description: Farms "All Drops" From Quest: "Flames of Love".
tags: Flames of Love, drops
*/
// Port of Scripts/Other/TyroniusWeddingGift.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class TyroniusWeddingGift {
    loot: string[] = ["Wedding Staff of the ShadowFire", "ShadowFire Wedding Guest"];

    snowball(): void {
        if (Core.checkInventory(this.loot)) {
            return;
        }

        Core.addDrop(...this.loot);
        Core.equipClass(ClassType.Solo);
        // Flames of Love
        Core.registerQuests(10787);
        while (!bot.shouldExit && !Core.checkInventory(this.loot)) {
            Core.huntMonster("fireplanewar", "Shadefire Onslaught", "Flame of Passion", 8);
            Core.huntMonster("skytower", "Sunstone", "Sunlit Warmth", 8);
            bot.wait.forQuestComplete(10787);
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new TyroniusWeddingGift();
    Core.setOptions();

    script.snowball();

    Core.setOptions(false);
}
