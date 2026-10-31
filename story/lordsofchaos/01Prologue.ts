/*
name: Prologue
description: This will finish the Prologue quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, prologue
*/
// Port of Scripts/Story/LordsofChaos/01Prologue.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaPrologue {}

export default function main(): void {
    Core.setOptions();

    LOC.prologue();

    Core.setOptions(false);
}
