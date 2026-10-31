/*
name: GoatedAccessories
description: This script will optain all rewards from the `Goated Accessories` quest.
tags: GoatedAccessories, goated, accessories, goated accessories, april fools, seasonal
*/
// Port of Scripts/Seasonal/AprilFools/GoatedAccessories.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class GoatedAccessories {
    getStuff(): void {
        const Rewards = Core.questRewards(10155);

        if (Core.checkInventory(Rewards, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(...Rewards);
        Core.equipClass(ClassType.Solo);
        Core.registerQuests(10155);
        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            Core.killMonster("j6cruise", "Frame3", "Left", "MEGA-GOAT");
        }
        Core.cancelRegisteredQuests();
        Core.jumpWait();
        Core.toBank(...Rewards);
    }
}

export default function main(): void {
    const script = new GoatedAccessories();
    Core.setOptions();

    script.getStuff();

    Core.setOptions(false);
}
