/*
name: Necro Tower
description: This will complete the Necro Tower quest.
tags: story, quest, doomwood, necro-tower, part1
*/
// Port of Scripts/Story/Doomwood/Part1/3NecroTower.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class NecroTower {}

export default function main(): void {
    Core.setOptions();

    DW.necroTower();

    Core.setOptions(false);
}
