/*
name: Sparrows Blood Daily
description: Sparrows Blood
tags: daily, sparrows blood, void highlord, VHL, nulgath, elders blood
*/
// Port of Scripts/Dailies/SparrowsBlood.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class SparrowsBlood {}

export default function main(): void {
    Core.setOptions();

    Daily.sparrowsBlood();

    Core.setOptions(false);
}
