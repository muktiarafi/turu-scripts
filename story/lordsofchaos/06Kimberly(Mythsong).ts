/*
name: (Mythsong) Kimberly
description: This will finish the Kimberly quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, mythsong, kimberly
*/
// Port of Scripts/Story/LordsofChaos/06Kimberly(Mythsong).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaMythsong {}

export default function main(): void {
    Core.setOptions();

    LOC.kimberly();

    Core.setOptions(false);
}
