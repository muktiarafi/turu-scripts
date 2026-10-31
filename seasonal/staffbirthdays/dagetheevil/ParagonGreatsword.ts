/*
name: Paragon Greatsword BattleGear
description: This script will complete the "Soul Food" [10104] quest for Paragon Greatsword BattleGear.
tags: dage, birthday, seasonal, soul food, bonus quest, paragon,greatsword,battlegear
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/ParagonGreatsword.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../../core/CoreBots";

export class ParagonGS {
    getCape(): void {
        if (Core.checkInventory(43061)) {
            return;
        }

        Core.addDrop(43061);
        Core.huntMonsterQuest(
            10104,
            ["darkpath", "Void Knight", ClassType.Farm],
            ["darkpath", "Void Wyrm", ClassType.Solo],
            ["darkpath", "Void Elemental", ClassType.Farm],
        );
        bot.wait.forPickup(43061);
    }
}

export default function main(): void {
    const script = new ParagonGS();
    Core.setOptions();

    script.getCape();

    Core.setOptions(false);
}
