/*
name: FiendEmblem
description: null
tags: null
*/
// Port of Scripts/Nation/Materials/FiendEmblem.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class FiendEmblem {
    fiendEmblemFarm(): void {
        if (Core.checkInventory("Fiend Emblem", 300)) {
            Core.logger("You already have 300 (Max Quantity) Fiend Emblem");
            return;
        }

        Core.addDrop("Fiend Emblem");

        while (!bot.shouldExit && !Core.checkInventory("Fiend Emblem", 300)) {
            Core.ensureAccept(7890);

            Core.equipClass(ClassType.Farm);
            Core.killMonster("originul", "r5", "Right", "*", "Essence of The Citadel", 30);

            Core.equipClass(ClassType.Solo);
            Core.huntMonster("originul", "Fiend Champion", "Champion's Essence");

            Core.ensureComplete(7890);
            bot.wait.forPickup("Fiend Emblem");
        }
    }
}

export default function main(): void {
    const script = new FiendEmblem();
    Core.setOptions();

    script.fiendEmblemFarm();

    Core.setOptions(false);
}
