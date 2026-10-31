/*
name: Complete Doomwood Part 2
description: This will complete the Doomwood Part 2 quest.
tags: story, quest, doomwood, complete, part2
*/
// Port of Scripts/Story/Doomwood/Part2/0CompletePart2.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class DoomwoodPart2 {}

export default function main(): void {
    Core.setOptions();

    DW.doomwoodPart2();

    Core.setOptions(false);
}
