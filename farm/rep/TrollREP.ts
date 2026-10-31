/*
name: Troll REP
description: This script will farm Troll reputation to rank 10.
tags: troll, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/TrollREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class TrollREP {}

export default function main(): void {
    Core.setOptions();

    Farm.trollREP();

    Core.setOptions(false);
}
