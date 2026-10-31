/*
name: Un-Lifeguard Quest
description: This will finish the Un-Lifeguard Quest.
tags: quest, un-lifeguard, summer-break
*/
// Port of Scripts/Seasonal/SummerBreak/Un-LifeguardQuest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class UnLifeGuardQuest {
    getItems(): void {
        if (!Core.isSeasonalMapActive("summerbreak")) {
            return;
        }

        const nonMemrewards = ["LifeGuard", "LifeGuard Cap + Locks", "LifeGuard Cap", "LifeGuard Tube"];
        const memRewards = [
            "LifeGuard",
            "LifeGuard Cap + Locks",
            "LifeGuard Cap",
            "LifeGuard Tube",
            "LifeGuard Tube of DOOM",
        ];
        const rewards = Core.isMember ? memRewards : nonMemrewards;
        if (Core.checkInventory(rewards, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(...rewards);
        Core.registerQuests(7579);
        while (!bot.shouldExit && Core.checkInventory(rewards)) {
            Core.huntMonster("summerbreak", "Cyborg Shark", "Cyborg Shark Tooth", 7, { isTemp: false });
            Core.sleep();
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new UnLifeGuardQuest();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}
