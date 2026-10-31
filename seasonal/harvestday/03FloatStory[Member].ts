/*
name: Float Story (Member)
description: This will finish the Float storyline.
tags: float-story, seasonal, harvest-day, member
*/
// Port of Scripts/Seasonal/HarvestDay/03FloatStory[Member].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class FloatStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.float();

    Core.setOptions(false);
}
