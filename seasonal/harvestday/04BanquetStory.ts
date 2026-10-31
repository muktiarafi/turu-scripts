/*
name: Banquet Story
description: This will finish the Banquet storyline.
tags: banquet-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/04BanquetStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class BanquetStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.banquet();

    Core.setOptions(false);
}
