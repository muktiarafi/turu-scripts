/*
name: Doomwood REP
description: This script will farm Doomwood reputation to rank 10.
tags: doomwood, doom, wood, reputation, rank, rep
*/
// Port of Scripts/Farm/REP/DoomwoodREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class DoomwoodREP {}

export default function main(): void {
    Core.setOptions();

    Farm.doomWoodREP();

    Core.setOptions(false);
}
