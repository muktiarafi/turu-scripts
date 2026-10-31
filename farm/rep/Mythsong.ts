/*
name: Mythsong REP
description: This script will farm Mythsong reputation to rank 10.
tags: myth, song, mythsong, myth song, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/Mythsong.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { Core13LoC } from "../../story/lordsofchaos/Core13LoC";

const Farm = new CoreFarms();
const LOC = new Core13LoC();

export class MythsongREP {
    doRep(): void {
        LOC.kimberly();
        Farm.mythsongREP();
    }
}

export default function main(): void {
    const script = new MythsongREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
