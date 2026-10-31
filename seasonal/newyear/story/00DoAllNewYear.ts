/*
name: Complete New Year Story
description: This will complete the New Year story and farm the required items.
tags: story, quest, seasonal, new-year
*/
// Port of Scripts/Seasonal/NewYear/Story/00DoAllNewYear.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNewYear } from "../CoreNewYear";

const NY = new CoreNewYear();

export class DoAllNewYear {}

export default function main(): void {
    Core.setOptions();

    NY.doAll();

    Core.setOptions(false);
}
