/*
name: CraggleRock REP
description: This script will farm CraggleRock reputation to rank 10.
tags: craggle, rock, rep, reputation, rank
*/
// Port of Scripts/Farm/REP/CraggleRockREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class CraggleRockREP {}

export default function main(): void {
    Core.setOptions();

    Farm.craggleRockREP();

    Core.setOptions(false);
}
