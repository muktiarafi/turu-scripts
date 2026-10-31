/*
name: Grams Story
description: This will finish the Grams storyline.
tags: grams-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/05GramsStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class GramsStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.grams();

    Core.setOptions(false);
}
