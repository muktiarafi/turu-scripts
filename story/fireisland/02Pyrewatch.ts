/*
name: Pyrewatch
description: This will finish the Pyrewatch quest.
tags: story, quest, fire-island, pyrewatch
*/
// Port of Scripts/Story/Fireisland/02Pyrewatch.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class Pyrewatch {}

export default function main(): void {
    Core.setOptions();

    FI.pyrewatch();

    Core.setOptions(false);
}
