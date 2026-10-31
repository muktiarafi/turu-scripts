/*
name: Chrono Phoenix Story
description: This will complete the Chrono Phoenix story.
tags: story, quest, seasonal, new-year, chrono-phoenix
*/
// Port of Scripts/Seasonal/NewYear/Story/05ChronoPhoenixStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNewYear } from "../CoreNewYear";

const NY = new CoreNewYear();

export class ChronoPhoenix {}

export default function main(): void {
    Core.setOptions();

    NY.chronoPhoenix();

    Core.setOptions(false);
}
