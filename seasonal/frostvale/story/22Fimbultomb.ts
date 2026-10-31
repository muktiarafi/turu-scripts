/*
name: Fimbultomb Story
description: This script completes the Fimbultomb quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,fimbultomb
*/
// Port of Scripts/Seasonal/Frostvale/Story/22Fimbultomb.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class Fimbultomb {}

export default function main(): void {
    Core.setOptions();

    Frost.fimbultomb();
    Core.setOptions(false);
}
