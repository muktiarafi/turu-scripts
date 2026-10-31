/*
name: Deer Hunt Story
description: This script completes the DeerHunt quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,deerhunt
*/
// Port of Scripts/Seasonal/Frostvale/Story/19DeerHunt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class DeerHunt {}

export default function main(): void {
    Core.setOptions();

    Frost.deerHunt();
    Core.setOptions(false);
}
