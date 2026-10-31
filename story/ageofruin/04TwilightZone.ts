/*
name: Twilight Zone
description: This script completes the storyline in /twilightzone.
tags: age, of, ruin, saga, story, quest, zone, twilight
*/
// Port of Scripts/Story/AgeOfRuin/04TwilightZone.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class TwilightZone {}

export default function main(): void {
    Core.setOptions();

    AOR.twilightZone();
    Core.setOptions(false);
}
