/*
name: Elemental Master REP
description: This script will farm Elemental Master reputation to rank 10.
tags: elemental, master, elementalmaster, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/ElementalMasterREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class ElementalMasterREP {}

export default function main(): void {
    Core.setOptions();

    Farm.elementalMasterREP();

    Core.setOptions(false);
}
