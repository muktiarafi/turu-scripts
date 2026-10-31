/*
name: Yokai Pirate
description: This script will complete "Yokai Pirate" storyline.
tags: story, quest, saga, dragons, dragon, yokai, pirate, complete, all
*/
// Port of Scripts/Story/DragonsOfYokai/01YokaiPirate.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDOY } from "./CoreDOY";

const DOY = new CoreDOY();

export class YokaiPirate {}

export default function main(): void {
    Core.setOptions();

    DOY.yokaiPirate();
    Core.setOptions(false);
}
