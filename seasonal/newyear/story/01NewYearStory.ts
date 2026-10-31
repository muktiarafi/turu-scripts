/*
name: New Year Story
description: This will complete the New Year story.
tags: story, quest, seasonal, new-year
*/
// Port of Scripts/Seasonal/NewYear/Story/01NewYearStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNewYear } from "../CoreNewYear";

const NY = new CoreNewYear();

export class NewYear {}

export default function main(): void {
    Core.setOptions();

    NY.newYear();

    Core.setOptions(false);
}
