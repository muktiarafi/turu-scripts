/*
name: Artix Home Story (Member)
description: This will finish the Artix Home storyline.
tags: artix-home-story, member, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/06ArtixHomeStory[Member].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class ArtixHomeStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.artixHome();

    Core.setOptions(false);
}
