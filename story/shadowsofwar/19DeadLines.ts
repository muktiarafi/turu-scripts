/*
name: Deadlines
description: This will finish the Deadlines quest.
tags: story, quest, shadow-war, deadlines
*/
// Port of Scripts/Story/ShadowsOfWar/19DeadLines.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Deadlines {}

export default function main(): void {
    Core.setOptions();

    SoW.deadLines();

    Core.setOptions(false);
}
