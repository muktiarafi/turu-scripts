/*
name: Feverfew
description: This will finish the Feverfew quest.
tags: story, quest, fire-island, feverfew
*/
// Port of Scripts/Story/Fireisland/03Feverfew.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFireIsland } from "./CoreFireisland";

const FI = new CoreFireIsland();

export class Feverfew {}

export default function main(): void {
    Core.setOptions();

    FI.feverfew();

    Core.setOptions(false);
}
