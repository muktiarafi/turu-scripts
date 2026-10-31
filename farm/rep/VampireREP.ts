/*
name: Vampire REP
description: This script will farm Vampire reputation to rank 10.
tags: vampire, rank, rep, reputation
*/
// Port of Scripts/Farm/REP/VampireREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Farm = new CoreFarms();
const LOC = new Core13LoC();

export class VampireREP {
    doRep(): void {
        LOC.wolfwing();
        Farm.vampireREP();
    }
}

export default function main(): void {
    const script = new VampireREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
