/*
name: Otzi War Story
description: This script completes the Otziwar quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,otziwar
*/
// Port of Scripts/Seasonal/Frostvale/Story/24Otziwar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Otziwar {}

export default function main(): void {
    Core.setOptions();

    Frost.otziwar();
    Core.setOptions(false);
}
