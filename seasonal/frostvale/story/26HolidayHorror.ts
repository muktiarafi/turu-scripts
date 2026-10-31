/*
name: Holiday Horror Story
description: This script completes the HolidayHorror quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,holidayhorror
*/
// Port of Scripts/Seasonal/Frostvale/Story/26HolidayHorror.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class HolidayHorror {}

export default function main(): void {
    Core.setOptions();

    Frost.holidayHorror();
    Core.setOptions(false);
}
