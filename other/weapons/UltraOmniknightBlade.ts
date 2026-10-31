/*
name: UltraOmniknightBlade
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/UltraOmniknightBlade.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class UltraOmniKnightBlade {
    freeRare(): void {
        if (Core.checkInventory("Ultra OmniKnight Blade")) {
            return;
        }

        Core.addDrop("Legend of Vordred");
        Core.ensureAccept(4565);
        Core.huntMonster("vordredboss", "Vordred", "Vordred's Skull");
        Core.ensureComplete(4565);

        Core.buyItem("battleon", 1163, "Ultra OmniKnight Blade");
    }
}

export default function main(): void {
    const script = new UltraOmniKnightBlade();
    Core.setOptions();

    script.freeRare();

    Core.setOptions(false);
}
