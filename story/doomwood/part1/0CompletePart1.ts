/*
name: Complete Doomwood Part 1
description: This will complete the Doomwood Part 1 story.
tags: story, quest, doomwood, complete, part1
*/
// Port of Scripts/Story/Doomwood/Part1/0CompletePart1.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class DoomwoodPart1 {}

export default function main(): void {
    Core.setOptions();

    DW.doomwoodPart1();

    Core.setOptions(false);
}
