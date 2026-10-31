/*
name: Sea Voice
description: This script completes the storyline in /trenchobserve.
tags: age, of, ruin, saga, story, quest, deep, water, trenchobserve, observation, deck, sea, voice
*/
// Port of Scripts/Story/AgeOfRuin/09SeaVoice.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class SeaVoice {}

export default function main(): void {
    Core.setOptions();

    AOR.seaVoice();

    Core.setOptions(false);
}
