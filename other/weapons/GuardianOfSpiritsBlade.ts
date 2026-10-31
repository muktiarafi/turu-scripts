/*
name: GuardianOfSpiritsBlade
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/GuardianOfSpiritsBlade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class GuardianOfSpiritsBlade {
    getGoSB(): void {
        if (Core.checkInventory("Guardian of Spirits' Blade")) {
            return;
        }

        Core.addDrop("Guardian of Spirits' Blade");
        Core.ensureAccept(4510);
        Core.equipClass(ClassType.Farm);
        Core.huntMonster("celestialrealm", "Fallen Knight", "Trapped Spirits", 500, { isTemp: false });
        Core.ensureComplete(4510);
        bot.wait.forPickup("Guardian of Spirits' Blade");
    }
}

export default function main(): void {
    const script = new GuardianOfSpiritsBlade();
    Core.setOptions();

    script.getGoSB();

    Core.setOptions(false);
}
