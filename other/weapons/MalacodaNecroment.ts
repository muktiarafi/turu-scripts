/*
name: MalacodaNecroment
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/MalacodaNecroment.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class MalacodaNecroment {
    freeLegendary(): void {
        if (Core.checkInventory("Malacoda Necroment")) {
            return;
        }

        Core.addDrop("Malacoda Necroment");
        Core.ensureAccept(3577);
        Core.huntMonster("battleundera", "Lich", "Crystal of Reanimation");
        Core.ensureComplete(3577, 24217);
    }
}

export default function main(): void {
    const script = new MalacodaNecroment();
    Core.setOptions();

    script.freeLegendary();

    Core.setOptions(false);
}
