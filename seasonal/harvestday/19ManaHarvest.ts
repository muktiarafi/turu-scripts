/*
name: Mana Harvest Story
description: This will finish the Mana Harvest storyline.
tags: manaharvest,mana harvest, seasonal, harvest-day,mana,harvest
*/
// Port of Scripts/Seasonal/HarvestDay/19ManaHarvest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class ManaHarvest {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.manaHarvest();

    Core.setOptions(false);
}
