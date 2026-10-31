/*
name: Blade of Awe
description: This bot will farm the Blade of Awe reputation up to rank 6 and get the Blade of Awe itself
tags: blade, awe, enhancements, boost, experience, reputation, class, points, gold, cp
*/
// Port of Scripts/Good/GearOfAwe/BladeOfAwe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class BladeOfAwe {
    getBoA(): void {
        Farm.bladeofAweREP(6, true);
    }
}

export default function main(): void {
    const script = new BladeOfAwe();
    Core.setOptions();

    script.getBoA();

    Core.setOptions(false);
}
