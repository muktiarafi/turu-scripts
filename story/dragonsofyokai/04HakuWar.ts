/*
name: Haku War
description: This script will complete "Haku War" storyline.
tags: story, quest, saga, dragons, dragon, haku, war, hakuwar, complete, all
*/
// Port of Scripts/Story/DragonsOfYokai/04HakuWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDOY } from "./CoreDOY";

const DOY = new CoreDOY();

export class HakuWar {}

export default function main(): void {
    Core.setOptions();

    DOY.hakuWar();
    Core.setOptions(false);
}
