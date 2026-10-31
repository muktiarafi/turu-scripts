/*
name: Snow Globe Story
description: This script completes the SnowGlobe quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,snowglobe
*/
// Port of Scripts/Seasonal/Frostvale/Story/02SnowGlobe.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class SnowGlobe {}

export default function main(): void {
    Core.setOptions();

    Frost.snowGlobe();
    Core.setOptions(false);
}
