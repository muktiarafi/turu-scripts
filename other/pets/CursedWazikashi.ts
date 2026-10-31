/*
name: Cursed Wazikashi Pet
description: gets the pet
tags: cursed wazikashi, pet
*/
// Port of Scripts/Other/Pets/CursedWazikashi.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class CursedWazikashi {
    cursedWakizashiPet(): void {
        if (Core.checkInventory("Cursed Wakizashi Pet", undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(79316, 79317, 79318, 79319, 79320);

        // Get item to  start quest [required]
        if (!Core.checkInventory(79316)) {
            Core.getMapItem(12046, 1, "museum");
        }

        // Crescent's Confession[DoomKitten]
        Adv.gearStore(undefined, { enhAfter: true });
        Core.killDoomKitten("Crescent's Confession");
        Adv.gearStore(true, { enhAfter: true });

        //Steel Amulet
        Core.equipClass(ClassType.Farm);
        Core.killMonster("moonyardb", "r28", "Left", "*", "Steel Amulet");

        // Master Pockey Ball
        if (!Core.checkInventory(79320)) {
            Core.getMapItem(12047, 1, "superslayin");
        }

        // Broken Bamboo Chunk
        Core.huntMonster("shogunwar", "Bamboo Treeant", "Broken Bamboo Chunk", undefined, { isTemp: false });

        // Combin
        Core.buyItem("yokairiver", 2326, "Cursed Wakizashi Pet", undefined, 12048);
    }
}

export default function main(): void {
    const script = new CursedWazikashi();
    Core.setOptions();

    script.cursedWakizashiPet();

    Core.setOptions(false);
}
