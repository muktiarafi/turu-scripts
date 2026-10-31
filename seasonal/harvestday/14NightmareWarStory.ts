/*
name: Nightmare War Story
description: This will finish the Nightmare War storyline.
tags: nightmare-war-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/14NightmareWarStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class NightmareWarStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.nightmareWar();

    Core.setOptions(false);
}
