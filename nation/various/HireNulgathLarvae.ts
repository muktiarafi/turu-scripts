/*
name: HireNulgathLarvae
description: null
tags: null
*/
// Port of Scripts/Nation/Various/HireNulgathLarvae.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class HireNulgathLarvae {
    getthething(): void {
        if (Core.checkInventory("Nulgath Larvae")) {
            return;
        }

        Nation.hireNulgathLarvae();
    }
}

export default function main(): void {
    const script = new HireNulgathLarvae();
    Core.setOptions();

    script.getthething();

    Core.setOptions(false);
}
