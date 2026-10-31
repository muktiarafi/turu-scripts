/*
name: Deep Water
description: This script completes the storyline in /trenchobserve.
tags: age, of, ruin, saga, story, quest, deep, water, trenchobserve, observation, deck
*/
// Port of Scripts/Story/AgeOfRuin/08DeepWater.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class DeepWater {}

export default function main(): void {
    Core.setOptions();

    AOR.deepWater();
    Core.setOptions(false);
}
