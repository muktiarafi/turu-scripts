/*
name: Dark Sun Story
description: This will complete the Dark Sun story.
tags: story, quest, seasonal, new-year, dark-sun
*/
// Port of Scripts/Seasonal/NewYear/Story/02DarkSunStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNewYear } from "../CoreNewYear";

const NY = new CoreNewYear();

export class DarkSun {}

export default function main(): void {
    Core.setOptions();

    NY.darkSun();

    Core.setOptions(false);
}
