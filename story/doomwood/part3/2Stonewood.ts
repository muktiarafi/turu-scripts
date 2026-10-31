/*
name: Stone Wood
description: This will finish the Stone Wood quest.
tags: story, quest, doomwood, stonewood, part3
*/
// Port of Scripts/Story/Doomwood/Part3/2Stonewood.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class Stonewood {}

export default function main(): void {
    Core.setOptions();

    DW.stonewood();

    Core.setOptions(false);
}
