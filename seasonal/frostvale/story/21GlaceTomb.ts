/*
name: Glace Tomb Story
description: This script completes the GlaceTomb quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,glacetomb
*/
// Port of Scripts/Seasonal/Frostvale/Story/21GlaceTomb.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class GlaceTomb {}

export default function main(): void {
    Core.setOptions();

    Frost.glaceTomb();
    Core.setOptions(false);
}
