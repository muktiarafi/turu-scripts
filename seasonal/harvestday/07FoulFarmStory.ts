/*
name: Foul Farm Story
description: This will finish the Foul Farm storyline.
tags: foul-farm-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/07FoulFarmStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class FoulFarmStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.foulFarm();

    Core.setOptions(false);
}
