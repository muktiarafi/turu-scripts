/*
name: Complete Doomwood Part 3
description: This will complete the Doomwood Part 3 quest.
tags: story, quest, doomwood, complete, part3
*/
// Port of Scripts/Story/Doomwood/Part3/0CompletePart3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class DoomwoodPart3 {}

export default function main(): void {
    Core.setOptions();

    DW.doomwoodPart3();

    Core.setOptions(false);
}
