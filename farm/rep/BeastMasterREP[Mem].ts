/*
name: BeastMaster REP
description: This script will farm BeastMaster reputation to rank 10.
tags: beastmaster, beast master, reputation, rep, farm, rank
*/
// Port of Scripts/Farm/REP/BeastMasterREP[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class BeastMasterREP {}

export default function main(): void {
    Core.setOptions();

    Farm.beastMasterREP();

    Core.setOptions(false);
}
