/*
name: Skyguard REP (Mem)
description: This script will farm Skyguard (MEM) reputation to rank 10.
tags: sky guard, skyguard, mem, member, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/SkyguardREP[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class SkyguardREP {}

export default function main(): void {
    Core.setOptions();

    Farm.skyguardREP();

    Core.setOptions(false);
}
