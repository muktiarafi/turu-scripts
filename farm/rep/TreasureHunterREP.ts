/*
name: TreasureHunter REP
description: This script will farm TreasureHunter reputation to rank 10.
tags: treasure hunter, treasurehunter, treasure, hunter, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/TreasureHunterREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class TreasureHunterREP {}

export default function main(): void {
    Core.setOptions();

    Farm.treasureHunterREP();

    Core.setOptions(false);
}
