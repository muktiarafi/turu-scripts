/*
name: Eternal REP
description: This script will farm Eternal reputation to rank 10.
tags: eternal, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/EternalREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const Farm = new CoreFarms();
const TOD = new CoreToD();

export class EternalREP {
    doRep(): void {
        TOD.fourthDimensionalPyramid();
        Farm.eternalREP();
    }
}

export default function main(): void {
    const script = new EternalREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
