/*
name: DoomWormCreepers
description: null
tags: null
*/
// Port of Scripts/Nation/OblivionBlade(RareandNot)/DoomWormCreepers.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOblivionBladeofNulgath } from "./CoreOblivionBladeofNulgath";

const COBoN = new CoreOblivionBladeofNulgath();

export class DoomWormCreepers {}

export default function main(): void {
    Core.setOptions();

    COBoN.doomWormCreepers();

    Core.setOptions(false);
}
