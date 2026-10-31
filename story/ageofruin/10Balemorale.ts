/*
name: Balemorale Castle
description: This script completes the storyline in /balemorale.
tags: age, of, ruin, saga, story, quest, balemorale, castle, bale morale
*/
// Port of Scripts/Story/AgeOfRuin/10Balemorale.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class Balemorale {}

export default function main(): void {
    Core.setOptions();

    AOR.balemorale();

    Core.setOptions(false);
}
