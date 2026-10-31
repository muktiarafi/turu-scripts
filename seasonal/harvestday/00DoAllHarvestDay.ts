/*
name: Harvest Day All Stories
description: This will finish the entire Harvest Day storylines.
tags: harvest-day-stories, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/00DoAllHarvestDay.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class DoAllHarvestDay {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.doAll();

    Core.setOptions(false);
}
