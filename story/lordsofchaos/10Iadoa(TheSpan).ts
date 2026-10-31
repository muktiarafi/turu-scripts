/*
name: (The Span) Iadoa
description: This will finish the Iadoa quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, the-span, iadoa
*/
// Port of Scripts/Story/LordsofChaos/10Iadoa(TheSpan).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaTheSpan {}

export default function main(): void {
    Core.setOptions();

    LOC.iadoa();

    Core.setOptions(false);
}
