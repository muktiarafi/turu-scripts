/*
name: Mysterious Dungeon REP
description: This script will farm Mysterious Dungeon reputation to rank 10.
tags: mysterious, dungeon, mysterious dungeon, mysteriousdungeon, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/MysteriousDungeonREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class MysteriousDungeonREP {}

export default function main(): void {
    Core.setOptions();

    Farm.mysteriousDungeonREP();

    Core.setOptions(false);
}
