/*
name: Epil Take Over Story
description: This will finish the Ebil Take Over storyline.
tags: ebil-take-over-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/15EpilTakeOverStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class EpilTakeOverStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.epilTakeOver();

    Core.setOptions(false);
}
