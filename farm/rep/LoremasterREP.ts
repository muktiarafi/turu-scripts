/*
name: Loremaster REP
description: This script will farm Loremaster reputation to rank 10.
tags: lore, master, loremaster, lore master, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/LoremasterREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class LoremasterREP {}

export default function main(): void {
    Core.setOptions();

    Farm.loremasterREP();

    Core.setOptions(false);
}
