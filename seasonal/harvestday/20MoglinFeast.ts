/*
name: Moglin Feast Story
description: This will finish the Moglin Feast storyline.
tags: moglinfeast,moglin feast, seasonal, harvest-day,moglin,feast
*/
// Port of Scripts/Seasonal/HarvestDay/20MoglinFeast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class MoglinFeast {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.moglinFeast();

    Core.setOptions(false);
}
