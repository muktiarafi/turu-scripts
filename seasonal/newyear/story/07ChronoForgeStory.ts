/*
name: ChronoForge Story
description: This script will complete the storyline in /chronogem
tags: chronogem, chrono forge, gem, new year, seasonal, story, forgemaster
*/
// Port of Scripts/Seasonal/NewYear/Story/07ChronoForgeStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNewYear } from "../CoreNewYear";

const NY = new CoreNewYear();

export class ChronoForge {}

export default function main(): void {
    Core.setOptions();

    NY.chronoForge();

    Core.setOptions(false);
}
