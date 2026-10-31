/*
name: Death Pit Brawl REP
description: This script will farm Death Pit Brawl reputation to rank 10.
tags: deathpitbrawl, deathpit, brawl, reputation, rep, rank
*/
// Port of Scripts/Farm/REP/DeathPitBrawlRep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreToD } from "../../story/throneofdarkness/CoreToD";

const Farm = new CoreFarms();
const coreToD = new CoreToD();

export class DeathPitBrawlREP {
    doRep(): void {
        coreToD.deathPitPVP();
        Farm.deathPitBrawlREP();
    }
}

export default function main(): void {
    const script = new DeathPitBrawlREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
