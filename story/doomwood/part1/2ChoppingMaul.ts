/*
name: Chopping Maul
description: This will finish the Chopping Maul quest.
tags: story, quest, doomwood, chopping-maul, part1
*/
// Port of Scripts/Story/Doomwood/Part1/2ChoppingMaul.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class ChoppingMaul {}

export default function main(): void {
    Core.setOptions();

    DW.choppingMaul();

    Core.setOptions(false);
}
