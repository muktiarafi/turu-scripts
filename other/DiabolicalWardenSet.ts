/*
name: Diabolical Warden Set
description: farms the "Diabolical Warden" set from Quest: "Summoning and Sealing".
tags: diabolical warden, set
*/
// Port of Scripts/Other/DiabolicalWardenSet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class DiabolicalWarden {
    getDrops(): void {
        const rewards = [
            "Diabolical Warden",
            "Diabolical Warden's Hair",
            "Diabolical Warden's Twintails",
            "Diabolical Warden's Visage",
            "Diabolical Warden's Visage + Locks",
            "Diabolical Zealot's Locks",
            "Diabolical Zealot's Ponytail",
        ];

        if (Core.checkInventory(rewards)) {
            Core.logger("You already have all of the items.");
            return;
        }

        Core.addDrop(...rewards);

        Core.equipClass(ClassType.Solo);

        bot.quests.updateQuest(9044);

        for (const Reward of rewards) {
            if (Core.checkInventory(Reward)) {
                Core.toBank(Reward);
                continue;
            }
            Core.farmingLogger(Reward, 1);
            Core.huntMonster("brokenwoods", "Eldritch Amalgamation", Reward, undefined, { isTemp: false, log: false });
            Core.toBank(Reward);
        }
    }
}

export default function main(): void {
    const script = new DiabolicalWarden();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
