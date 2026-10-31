/*
name: Cold Wind Valley Story
description: This script completes the ColdWindValley quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,coldwindvalley
*/
// Port of Scripts/Seasonal/Frostvale/Story/06ColdWindValley.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class ColdWindValley {}

export default function main(): void {
    Core.setOptions();

    Frost.coldWindValley();
    Core.setOptions(false);
}
