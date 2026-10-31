/*
name: Lycan REP
description: This script will farm Lycan reputation to rank 10.
tags: lycan, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/LycanREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Farm = new CoreFarms();
const LOC = new Core13LoC();

export class LycanREP {
    doRep(): void {
        LOC.wolfwing();
        Farm.lycanREP();
    }
}

export default function main(): void {
    const script = new LycanREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
