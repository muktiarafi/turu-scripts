/*
name: RandomWeaponOfNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/Various/RandomWeaponOfNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class RandomWepofNul {
    getWep(): void {
        if (Core.checkInventory("Random Weapon of Nulgath")) {
            return;
        }

        Nation.supplies("Random Weapon of Nulgath");
    }
}

export default function main(): void {
    const script = new RandomWepofNul();
    Core.setOptions();

    script.getWep();

    Core.setOptions(false);
}
