/*
name: Necropolis Cavern
description: This will complete the Necropolis Cavern quest.
tags: story, quest, doomwood, necropolis-cavern, part2
*/
// Port of Scripts/Story/Doomwood/Part2/2NecropolisCavern.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class NecropolisCavern {}

export default function main(): void {
    Core.setOptions();

    DW.necropolisCavern();

    Core.setOptions(false);
}
