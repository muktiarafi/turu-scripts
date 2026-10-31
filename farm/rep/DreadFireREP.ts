/*
name: Dreadfire REP
description: This script will farm Dreadfire reputation to rank 10.
tags: dreadfire, dread, reputation, rank, rep
*/
// Port of Scripts/Farm/REP/DreadFireREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class DreadfireREP {}

export default function main(): void {
    Core.setOptions();

    Farm.dreadfireREP();

    Core.setOptions(false);
}
