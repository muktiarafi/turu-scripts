/*
name: Turdraken Story (Member)
description: This will finish the Turdaken storyline.
tags: turdraken-story, seasonal, harvest-day, member
*/
// Port of Scripts/Seasonal/HarvestDay/02TurdrakenStory[Member].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class TurdrakenStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.turdraken();

    Core.setOptions(false);
}
