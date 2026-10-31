/*
name: Swindle Bulk
description: Farms Tainted Gem's until max stack using Swindle Bulk
tags: taintedgem, tainted, gem, swindle, bulk, nation, farm
*/
// Port of Scripts/Nation/Various/SwindleBulk.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class SwindleBulk {}

export default function main(): void {
    Core.setOptions();

    Nation.swindleBulk();

    Core.setOptions(false);
}
