/*
name: LanceOfTime
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/LanceOfTime.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class LanceOfTime {
    getLoT(): void {
        if (Core.checkInventory("Lance of Time")) {
            return;
        }

        Core.addDrop("Lance of Time");
        Core.ensureAccept(4512);
        Core.equipClass(ClassType.Farm);
        Core.huntMonster("celestialrealm", "Infernal Imp", "Captured Time", 500, { isTemp: false });
        Core.ensureComplete(4512);
        bot.wait.forPickup("Lance of Time");
    }
}

export default function main(): void {
    const script = new LanceOfTime();
    Core.setOptions();

    script.getLoT();

    Core.setOptions(false);
}
