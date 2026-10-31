/*
name: Harvest Story
description: This will finish the Harvest storyline.
tags: harvest-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/01HarvestStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class HarvestStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.harvest();

    Core.setOptions(false);
}
