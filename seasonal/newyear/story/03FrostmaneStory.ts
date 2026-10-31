/*
name: Frostmane Story
description: This will complete the Frostmane story.
tags: story, quest, seasonal, new-year, frostmane
*/
// Port of Scripts/Seasonal/NewYear/Story/03FrostmaneStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNewYear } from "../CoreNewYear";

const NY = new CoreNewYear();

export class Frostmane {}

export default function main(): void {
    Core.setOptions();

    NY.frostmane();

    Core.setOptions(false);
}
