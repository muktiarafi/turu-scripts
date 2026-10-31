/*
name: Yokai REP
description: This script will farm Yokai reputation to rank 10.
tags: yokai, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/YokaiREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class YokaiREP {}

export default function main(): void {
    Core.setOptions();

    Farm.yokaiREP();

    Core.setOptions(false);
}
