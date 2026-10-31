/*
name: Leveling [1-100]
description: This script will farm XP to max level.
tags: levelling, leveling, level, xp, experience, farm, exp
*/
// Port of Scripts/Farm/Leveling.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();

export class Leveling {
    doLeveling(): void {
        Farm.experience();
    }
}

export default function main(): void {
    const script = new Leveling();
    Core.setOptions();

    script.doLeveling();

    Core.setOptions(false);
}
