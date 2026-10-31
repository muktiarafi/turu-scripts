/*
name: Temple of the Light
description: This will finish the Temple of the Light quest.
tags: story, quest, doomwood, temple-of-the-light, part1
*/
// Port of Scripts/Story/Doomwood/Part1/5TempleOfLight.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class TempleOfTheLight {}

export default function main(): void {
    Core.setOptions();

    DW.templeOfTheLight();

    Core.setOptions(false);
}
