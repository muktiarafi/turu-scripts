/*
name: Holiday Hotel Story
description: This script completes the HolidayHotel quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,holidayhotel
*/
// Port of Scripts/Seasonal/Frostvale/Story/25HolidayHotel.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class HolidayHotel {}

export default function main(): void {
    Core.setOptions();

    Frost.holidayHotel();
    Core.setOptions(false);
}
