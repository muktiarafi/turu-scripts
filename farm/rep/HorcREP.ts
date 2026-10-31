/*
name: Horc REP
description: This script will farm Horc reputation to rank 10.
tags: horc, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/HorcREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class HorcREP {}

export default function main(): void {
    Core.setOptions();

    Farm.horcREP();

    Core.setOptions(false);
}
