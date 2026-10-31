/*
name: Icewind Pass Story
description: This script completes the Icewindpass quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,icewindpass
*/
// Port of Scripts/Seasonal/Frostvale/Story/14Icewindpass.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Icewindpass {}

export default function main(): void {
    Core.setOptions();

    Frost.icewindpass();
    Core.setOptions(false);
}
