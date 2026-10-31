/*
name: Swordhaven REP
description: This script will farm Swordhaven reputation to rank 10.
tags: sword haven, swordhaven, sword, haven, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/SwordhavenREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class SwordhavenREP {}

export default function main(): void {
    Core.setOptions();

    Farm.swordhavenREP();

    Core.setOptions(false);
}
