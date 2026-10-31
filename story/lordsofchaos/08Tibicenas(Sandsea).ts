/*
name: (Sandsea) Tibicenas
description: This will finish the Tibicenas quest.
tags: story, quest, chaos-saga, 13-lords-of-chaos, sandsea, tibicenas
*/
// Port of Scripts/Story/LordsofChaos/08Tibicenas(Sandsea).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class SagaSandsea {}

export default function main(): void {
    Core.setOptions();

    LOC.tibicenas();

    Core.setOptions(false);
}
