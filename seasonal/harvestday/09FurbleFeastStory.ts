/*
name: Furble Feast Story
description: This will finish the Furble Feast storyline.
tags: furble-feast-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/09FurbleFeastStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class FurbleFeastStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.furbleFeast();

    Core.setOptions(false);
}
