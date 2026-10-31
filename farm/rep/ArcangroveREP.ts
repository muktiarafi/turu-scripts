/*
name: Arcangrove REP
description: This script will farm Arcangrove reputation to rank 10.
tags: arcangrove, rep, reputation, farm, rank
*/
// Port of Scripts/Farm/REP/ArcangroveREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class ArcangroveREP {}

export default function main(): void {
    Core.setOptions();

    Farm.arcangroveREP();

    Core.setOptions(false);
}
