/*
name: Birds with Harms Story
description: This will finish the Birds with Harms storyline.
tags: birds-with-harms-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/16BirdsWithHarmsStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class BirdsWithHarmsStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.birdsWithHarms();

    Core.setOptions(false);
}
