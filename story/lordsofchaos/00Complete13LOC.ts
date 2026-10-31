/*
name: Complete Chaos Saga Story
description: This will finish the Chaos Saga story.
tags: story, quest, chaos saga, 13 lords of chaos, complete, all, all chaos, chaos, chaos all
*/
// Port of Scripts/Story/LordsofChaos/00Complete13LOC.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core13LoC } from "./Core13LoC";

const LOC = new Core13LoC();

export class CompleteChaosSaga {}

export default function main(): void {
    Core.setOptions();

    LOC.complete13LOC(true);

    Core.setOptions(false);
}
