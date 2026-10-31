/*
name: Hollowborn REP
description: This script will farm Hollowborn reputation to rank 10.
tags: hollow, born, hollowborn, hollow born, lae, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/HollowbornREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class HollowbornREP {}

export default function main(): void {
    Core.setOptions();

    //Rep boost type here crahes bestgear uncomment when fixed.

    Farm.hollowbornREP();

    Core.setOptions(false);
}
