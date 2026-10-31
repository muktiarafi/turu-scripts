/*
name: Junkheap
description: This will finish the Junkheap quest.
tags: story, quest, shadow-war, junkheap
*/
// Port of Scripts/Story/ShadowsOfWar/07Junkheap.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Junkheap {}

export default function main(): void {
    Core.setOptions();

    SoW.junkheap();

    Core.setOptions(false);
}
