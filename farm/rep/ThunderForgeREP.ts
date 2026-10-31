/*
name: ThunderForge REP
description: This script will farm ThunderForge reputation to rank 10.
tags: thunder forge, thunderforge, thunder, forge, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/ThunderForgeREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Farm = new CoreFarms();
const LOC = new Core13LoC();

export class ThunderForgeREP {
    doRep(): void {
        LOC.lionfang();

        Farm.thunderForgeREP();
    }
}

export default function main(): void {
    const script = new ThunderForgeREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
