/*
name: Complete Fire Island Story
description: This will complete the Fire Island story.
tags: story, quest, fire-island, complete, all
*/
// Port of Scripts/Story/Fireisland/00DoAllFireisland.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class DoAllFireisland {}

export default function main(): void {
    Core.setOptions();

    FI.completeFireIsland();

    Core.setOptions(false);
}
