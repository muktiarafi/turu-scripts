/*
name: Complete Doomwood Story
description: This will complete the Doomwood story.
tags: story, quest, doomwood, complete, all
*/
// Port of Scripts/Story/Doomwood/0CompleteDoomwood.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDoomwood } from "./CoreDoomwood";

const DW = new CoreDoomwood();

export class CompleteDoomwood {}

export default function main(): void {
    Core.setOptions();

    DW.completeDoomwood();

    Core.setOptions(false);
}
