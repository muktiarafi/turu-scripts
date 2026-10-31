/*
name: Icepike Story
description: This script completes the Icepike quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,icepike
*/
// Port of Scripts/Seasonal/Frostvale/Story/15Icepike.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Icepike {}

export default function main(): void {
    Core.setOptions();

    Frost.icepike();
    Core.setOptions(false);
}
