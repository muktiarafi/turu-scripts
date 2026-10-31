/*
name: Mad Scientist Lab
description: This will finish the Mad Scientist Lab quest.
tags: story, quest, doomwood, mad-scientist-lab, part1
*/
// Port of Scripts/Story/Doomwood/Part1/6MadScientistLab.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class MadScientistsLab {}

export default function main(): void {
    Core.setOptions();

    DW.madScientistsLab();

    Core.setOptions(false);
}
