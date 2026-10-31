/*
name: NCS Gem
description: This script will complete the daily quest for NCS Gem.
tags: daily, ncs, hollowborn, a lovely quest-ion, shadow realm
*/
// Port of Scripts/Dailies/NCSGem.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class NCSGem {}

export default function main(): void {
    Core.setOptions();

    Daily.nCSGem();

    Core.setOptions(false);
}
