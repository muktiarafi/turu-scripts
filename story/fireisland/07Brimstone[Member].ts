/*
name: Brimstone
description: This will finish the Brimstone quest.
tags: story, quest, fire-island, brimstone, member
*/
// Port of Scripts/Story/Fireisland/07Brimstone[Member].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class Brimstone {}

export default function main(): void {
    Core.setOptions();

    FI.brimstone();

    Core.setOptions(false);
}
