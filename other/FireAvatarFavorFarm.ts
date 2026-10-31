/*
name: Fire Avatar Favor
description: Farms "Fire Avatar's Favor" From Mob: "fireavatar".
tags: fire avatar's favor, fire avatar, drops
*/
// Port of Scripts/Other/FireAvatarFavorFarm.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";

export class FireAvatarFavorFarm {
    faFavor(quant = 300): void {
        if (Core.checkInventory("Fire Avatar's Favor", quant)) {
            return;
        }

        Core.addDrop("Fire Avatar's Favor");
        Core.equipClass(ClassType.Farm);

        Core.registerQuests(8244);
        while (!bot.shouldExit && !Core.checkInventory("Fire Avatar's Favor", quant)) {
            Core.killMonster("fireavatar", "r4", "Right", "*", "Onslaught Defeated", 6);
            Core.killMonster("fireavatar", "r6", "Left", "*", "Elemental Defeated", 6);

            bot.wait.forPickup("Fire Avatar's Favor");
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new FireAvatarFavorFarm();
    Core.setOptions();

    script.faFavor();

    Core.setOptions(false);
}
