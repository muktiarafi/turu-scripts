/*
name: Tech Dungeon
description: This will complete the Tech Dungeon quest.
tags: story, quest, doomwood, tech-dungeon, part3
*/
// Port of Scripts/Story/Doomwood/Part3/3TechDungeon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class TechDungeon {}

export default function main(): void {
    Core.setOptions();

    DW.techDungeon();

    Core.setOptions(false);
}
