/*
name: Spirit Orbs
description: This script farms the max quantity of Spirit Orbs.
tags: spirit, orbs, BLOD, blinding, light, destiny, good, soul searching
*/
// Port of Scripts/Good/BLoD/SpiritOrbs.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreBLOD } from "./CoreBLOD";

const BLOD = new CoreBLOD();

export class SpiritOrbs {}

export default function main(): void {
    Core.setOptions();

    BLOD.spiritOrb(65000);

    Core.setOptions(false);
}
