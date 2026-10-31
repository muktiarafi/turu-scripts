/*
name: Bow Jangles Story
description: This script completes the BowJangles quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,bowjangles
*/
// Port of Scripts/Seasonal/Frostvale/Story/20BowJangles.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class BowJangles {}

export default function main(): void {
    Core.setOptions();

    Frost.bowJangles();
    Core.setOptions(false);
}
