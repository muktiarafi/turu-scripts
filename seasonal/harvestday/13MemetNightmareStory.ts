/*
name: Memet Nightmare Story
description: This will finish the Memet Nightmare storyline.
tags: memet-nightmare-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/13MemetNightmareStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class MemetNightmareStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.memetNightmare();

    Core.setOptions(false);
}
