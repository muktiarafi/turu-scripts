/*
name: Ebil Corp HQ Story
description: This will finish the Ebil Corp HQ storyline.
tags: ebil-corp-hq-story, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/17EbilCorpHQStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHarvestDay } from "./CoreHarvestDay";

const HarvestDay = new CoreHarvestDay();

export class EbilCorpHQStory {}

export default function main(): void {
    Core.setOptions();

    HarvestDay.ebilCorpHQ();

    Core.setOptions(false);
}
