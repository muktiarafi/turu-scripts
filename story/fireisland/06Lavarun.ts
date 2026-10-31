/*
name: Lavarun
description: This will finish the Lavarun quest.
tags: story, quest, fire-island, lavarun
*/
// Port of Scripts/Story/Fireisland/06Lavarun.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class Lavarun {}

export default function main(): void {
    Core.setOptions();

    FI.lavarun();

    Core.setOptions(false);
}
