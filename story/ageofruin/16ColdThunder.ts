/*
name: ColdThunder
description: This script completes the storyline in /ColdThunder.
tags: age, of, ruin, saga, story, quest, cold thunder, sovereign of storms, sos
*/
// Port of Scripts/Story/AgeOfRuin/16ColdThunder.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class ColdThunder {}

export default function main(): void {
    Core.setOptions();

    AOR.coldThunder();

    Core.setOptions(false);
}
