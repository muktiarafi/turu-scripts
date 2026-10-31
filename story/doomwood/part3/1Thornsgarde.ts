/*
name: Thorns Garde
description: This will finish the Thorns Garde quest.
tags: story, quest, doomwood, thornsgarde, part3
*/
// Port of Scripts/Story/Doomwood/Part3/1Thornsgarde.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDoomwood } from "../CoreDoomwood";

const DW = new CoreDoomwood();

export class Thornsgarde {}

export default function main(): void {
    Core.setOptions();

    DW.thornsgarde();

    Core.setOptions(false);
}
