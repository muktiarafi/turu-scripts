/*
name: Brethwren REP Farm
description: This will farm Brethwren Faction to Rank 10.
tags: brethwren-rep, farm, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/BrethwrenREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreHarvestDay } from "./CoreHarvestDay";

const Farm = new CoreFarms();
const HarvestDay = new CoreHarvestDay();

export class BrethwrenREP {
    doRep(): void {
        HarvestDay.birdsWithHarms();

        Farm.brethwrenREP();
    }
}

export default function main(): void {
    const script = new BrethwrenREP();
    Core.setOptions();

    script.doRep();

    Core.setOptions(false);
}
