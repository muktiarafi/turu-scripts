/*
name: Brethwren REP [Seasonal]
description: This script will farm Brethwren reputation to rank 10.
tags: reputation, rep, seasonal, rank, farm
*/
// Port of Scripts/Farm/REP/BrethwrenREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreHarvestDay } from "../../seasonal/harvestday/CoreHarvestDay";

const Farm = new CoreFarms();
const HarvestDay = new CoreHarvestDay();

export class BrethwrenREPFarm {
    doRep(): void {
        HarvestDay.birdsWithHarms();

        Farm.brethwrenREP();
    }
}

export default function main(): void {
    const script = new BrethwrenREPFarm();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
