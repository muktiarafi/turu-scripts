/*
name: Aegis REP
description: This script will farm Aegis REP to rank 10.
tags: aegis, rep, reputation, farm
*/
// Port of Scripts/Farm/REP/AegisREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class AegisREP {}

export default function main(): void {
    Core.setOptions();

    Farm.aegisREP();

    Core.setOptions(false);
}
