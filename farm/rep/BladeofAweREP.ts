/*
name: Blade of Awe REP
description: This script will farm Blade of Awe reputation to rank 10.
tags: boa, bladeofawe, awe, reputation, rep, rank, farm
*/
// Port of Scripts/Farm/REP/BladeofAweREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class BladeofAweREP {}

export default function main(): void {
    Core.setOptions();

    Farm.bladeofAweREP(10, false);

    Core.setOptions(false);
}
