/*
name: (Yokai) Kitsune
description: This will finish the Kitsune quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, yokai, kitsune
*/
// Port of Scripts/Story/LordsofChaos/04Kitsune(Yokai).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaYokai {}

export default function main(): void {
    Core.setOptions();

    LOC.kitsune();

    Core.setOptions(false);
}
