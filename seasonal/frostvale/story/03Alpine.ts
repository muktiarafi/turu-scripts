/*
name: Alpine Story
description: This script completes the Alpine quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,alpine
*/
// Port of Scripts/Seasonal/Frostvale/Story/03Alpine.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Alpine {}

export default function main(): void {
    Core.setOptions();

    Frost.alpine();
    Core.setOptions(false);
}
