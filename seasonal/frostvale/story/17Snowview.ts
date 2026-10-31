/*
name: Snowview Story
description: This script completes the Snowview quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,snowview
*/
// Port of Scripts/Seasonal/Frostvale/Story/17Snowview.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Snowview {}

export default function main(): void {
    Core.setOptions();

    Frost.snowview();
    Core.setOptions(false);
}
