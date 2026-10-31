/*
name: Dwarfold REP
description: This script will farm Dwarfhold reputation to rank 10.
tags: dwarfhold, dwarf hold, hold, reputation, rep, rank
*/
// Port of Scripts/Farm/REP/DwarfholdREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class DwarfholdREP {}

export default function main(): void {
    Core.setOptions();

    Farm.dwarfholdREP();

    Core.setOptions(false);
}
