/*
name: Chaos REP
description: This script will farm Chaos reputation to rank 10.
tags: chaos, rep, reputation, rank
*/
// Port of Scripts/Farm/REP/ChaosREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class ChaosREP {}

export default function main(): void {
    Core.setOptions();

    Farm.chaosREP();

    Core.setOptions(false);
}
