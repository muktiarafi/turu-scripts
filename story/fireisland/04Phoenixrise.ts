/*
name: Phoenixrise
description: This will finish the Phoenixrise quest.
tags: story, quest, fire-island, phoenixrise
*/
// Port of Scripts/Story/Fireisland/04Phoenixrise.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class Phoenixrise {}

export default function main(): void {
    Core.setOptions();

    FI.phoenixrise();

    Core.setOptions(false);
}
