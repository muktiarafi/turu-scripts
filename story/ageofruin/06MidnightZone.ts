/*
name: Midnight Zone
description: This script completes the storyline in /midnightzone.
tags: age, of, ruin, saga, story, quest, zone, midnight
*/
// Port of Scripts/Story/AgeOfRuin/06MidnightZone.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class MidnightZone {}

export default function main(): void {
    Core.setOptions();

    AOR.midnightZone();
    Core.setOptions(false);
}
