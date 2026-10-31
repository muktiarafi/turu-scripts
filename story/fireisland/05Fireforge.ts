/*
name: Fireforge
description: This will finish the Fireforge quest.
tags: story, quest, fire-island, fireforge
*/
// Port of Scripts/Story/Fireisland/05Fireforge.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class Fireforge {}

export default function main(): void {
    Core.setOptions();

    FI.fireforge();

    Core.setOptions(false);
}
