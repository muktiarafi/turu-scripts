/*
name: Furborg Ship Story
description: This will finish the Furborg Ship storyline.
tags: furborg-ship-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/10FurborgShipStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class FurborgShipStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.furborgShip();

    Core.setOptions(false);
}
