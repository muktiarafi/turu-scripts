/*
name: Blight Harvest Story
description: This will finish the Blight Harvest storyline.
tags: blightharvest,blight harvest, seasonal, harvest-day,blight,harvest
*/
// Port of Scripts/Seasonal/HarvestDay/18BlightHarvest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class BlightHarvest {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.blightHarvest();

    Core.setOptions(false);
}
