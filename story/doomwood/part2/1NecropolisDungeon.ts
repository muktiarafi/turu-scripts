/*
name: Necropolis Dungeon
description: This will complete the Necropolis Dungeon quest.
tags: story, quest, doomwood, necropolis-dungeon, part2
*/
// Port of Scripts/Story/Doomwood/Part2/1NecropolisDungeon.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class NecropolisDungeon {}

export default function main(): void {
    Core.setOptions();

    DW.necropolisDungeon();

    Core.setOptions(false);
}
