/*
name: Chaos Saga Extra
description: This will finish the Chaos Saga Extra quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, extra
*/
// Port of Scripts/Story/LordsofChaos/15Extra.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaChaosExtra {}

export default function main(): void {
    Core.setOptions();

    LOC.extra();

    Core.setOptions(false);
}
