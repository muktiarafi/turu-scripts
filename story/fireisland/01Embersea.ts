/*
name: Embersea
description: This will finish the Embersea quest.
tags: story, quest, fire-island, embersea
*/
// Port of Scripts/Story/Fireisland/01Embersea.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class Embersea {}

export default function main(): void {
    Core.setOptions();

    FI.embersea();

    Core.setOptions(false);
}
