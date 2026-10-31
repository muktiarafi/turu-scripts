/*
name: AvatarOfDeathsScythe
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/AvatarOfDeathsScythe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class AvatarOfDeathsScythe {
    getAoDS(): void {
        if (Core.checkInventory("Avatar Of Death's Scythe")) {
            return;
        }

        Core.addDrop("Avatar Of Death's Scythe");
        Core.ensureAccept(4511);
        Core.equipClass(ClassType.Farm);
        Core.huntMonster("lostruins", "Underworld Hound", "Energy of Death", 500, { isTemp: false });
        Core.ensureComplete(4511);
        bot.wait.forPickup("Avatar Of Death's Scythe");
    }
}

export default function main(): void {
    const script = new AvatarOfDeathsScythe();
    Core.setOptions();

    script.getAoDS();

    Core.setOptions(false);
}
