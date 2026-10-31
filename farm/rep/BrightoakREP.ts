/*
name: Brightoak REP
description: This script will farm Brightoak REP to rank 10.
tags: bright, oak, reputation, rep, rank, farm
*/
// Port of Scripts/Farm/REP/BrightoakREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { BrightOak } from "../../story/queenofmonsters/extra/BrightOak";

const Farm = new CoreFarms();
const brightOak = new BrightOak();

export class BrightoakREP {
    doRep(): void {
        brightOak.doall(true);
        Farm.brightoakREP();
    }
}

export default function main(): void {
    const script = new BrightoakREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
