/*
name: Death Pit Arena REP
description: This script will farm Death Pit Arena reputation to rank 10.
tags: deathpitarena, deathpit, arena, reputation, rep, rank
*/
// Port of Scripts/Farm/REP/DeathPitArenaREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class DeathPitArenaREP {}

export default function main(): void {
    Core.setOptions();

    Farm.deathPitArenaREP();

    Core.setOptions(false);
}
