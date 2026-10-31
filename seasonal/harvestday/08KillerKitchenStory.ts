/*
name: Killer Kitchen Story
description: This will finish the Killer Kitchen storyline.
tags: killer-kitchen-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/08KillerKitchenStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class KillerKitchenStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.killerKitchen();

    Core.setOptions(false);
}
