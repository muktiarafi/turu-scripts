/*
name: Chaos Militia REP
description: This script will farm Chaos Militia reputation to rank 10.
tags: chaos, chaosmilitia, militia, rep, rank, farm, reputation
*/
// Port of Scripts/Farm/REP/ChaosMilitiaREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class ChaosMilitiaREP {}

export default function main(): void {
    Core.setOptions();

    Farm.chaosMilitiaREP();

    Core.setOptions(false);
}
