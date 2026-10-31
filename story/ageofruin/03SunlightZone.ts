/*
name: Sunlight Zone
description: This script completes the storyline in /sunlightzone.
tags: age, of, ruin, saga, story, quest, zone, sunlight
*/
// Port of Scripts/Story/AgeOfRuin/03SunlightZone.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class SunlightZone {}

export default function main(): void {
    Core.setOptions();

    AOR.sunlightZone();
    Core.setOptions(false);
}
