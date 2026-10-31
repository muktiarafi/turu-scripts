/*
name: KisstheVoid
description: null
tags: null
*/
// Port of Scripts/Nation/KisstheVoid.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class KisstheVoid {
    /** List of Betrayal Blades */
    betrayalBlades: string[] = [
        "1st Betrayal Blade of Nulgath",
        "2nd Betrayal Blade of Nulgath",
        "3rd Betrayal Blade of Nulgath",
        "4th Betrayal Blade of Nulgath",
        "5th Betrayal Blade of Nulgath",
        "6th Betrayal Blade of Nulgath",
        "7th Betrayal Blade of Nulgath",
        "8th Betrayal Blade of Nulgath",
    ];
}

export default function main(): void {
    const script = new KisstheVoid();
    Core.setOptions();
    //blades:
    for (const item of [
        "1st Betrayal Blade of Nulgath",
        "2nd Betrayal Blade of Nulgath",
        "3rd Betrayal Blade of Nulgath",
        "4th Betrayal Blade of Nulgath",
        "5th Betrayal Blade of Nulgath",
        "6th Betrayal Blade of Nulgath",
        "7th Betrayal Blade of Nulgath",
        "8th Betrayal Blade of Nulgath",
    ]) {
        Core.addDrop(...script.betrayalBlades);
        Nation.kisstheVoid(1, item);
    }

    //Blood Gems:
    Nation.kisstheVoid();

    Core.setOptions(false);
}
