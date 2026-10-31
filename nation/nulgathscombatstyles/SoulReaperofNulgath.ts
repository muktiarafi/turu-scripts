/*
name: SoulReaperofNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/NulgathsCombatStyles/SoulReaperofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class SoulReaperofNulgath {
    example(): void {
        if (Core.checkInventory("item")) {
            return;
        }

        //INSERT CODE HERE
    }
}

export default function main(): void {
    const script = new SoulReaperofNulgath();
    Core.setOptions();

    script.example();

    Core.setOptions(false);
}
