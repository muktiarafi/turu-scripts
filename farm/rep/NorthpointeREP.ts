/*
name: Northpointe REP
description: This script will farm Northpointe reputation to rank 10.
tags: northpoint, northpointe, north point e, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/NorthpointeREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class NorthpointeREP {}

export default function main(): void {
    Core.setOptions();

    Farm.northpointeREP();

    Core.setOptions(false);
}
