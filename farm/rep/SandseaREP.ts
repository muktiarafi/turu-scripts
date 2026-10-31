/*
name: Sandsea REP
description: This script will farm Sandsea reputation to rank 10.
tags: sandsea, sand sea, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/SandseaREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class SandseaREP {}

export default function main(): void {
    Core.setOptions();

    Farm.sandseaREP();

    Core.setOptions(false);
}
