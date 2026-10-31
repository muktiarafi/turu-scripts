/*
name: Somnia REP
description: This script will farm Somnia reputation to rank 10.
tags: somnia, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/SomniaREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class SomniaREP {}

export default function main(): void {
    Core.setOptions();

    Farm.somniaREP();

    Core.setOptions(false);
}
