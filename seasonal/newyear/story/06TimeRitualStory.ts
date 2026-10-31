/*
name: Time Ritual Story
description: This will complete the Time Ritual story.
tags: story, quest, seasonal, new-year, time-ritual
*/
// Port of Scripts/Seasonal/NewYear/Story/06TimeRitualStory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNewYear } from "../CoreNewYear";

const NY = new CoreNewYear();

export class TimeRitual {}

export default function main(): void {
    Core.setOptions();

    NY.timeRitual();

    Core.setOptions(false);
}
