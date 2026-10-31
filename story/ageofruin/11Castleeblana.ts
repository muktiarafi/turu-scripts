/*
name: Castle eblana
description: This script completes the storyline in /castleeblana.
tags: age, of, ruin, saga, story, quest, castleeblana, castle, eblana, castle eblana
*/
// Port of Scripts/Story/AgeOfRuin/11Castleeblana.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class Castleeblana {}

export default function main(): void {
    Core.setOptions();

    AOR.castleeblana();

    Core.setOptions(false);
}
