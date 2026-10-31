/*
name: Doomwood Forest
description: This will finish the Doomwood Forest quest.
tags: story, quest, doomwood, doomwood-forest, part1
*/
// Port of Scripts/Story/Doomwood/Part1/1DoomwoodForest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class DoomwoodForest {}

export default function main(): void {
    Core.setOptions();

    DW.doomwoodForest();

    Core.setOptions(false);
}
