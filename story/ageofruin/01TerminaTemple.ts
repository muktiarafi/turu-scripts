/*
name: Termina Temple
description: This script completes the storyline in /terminatemple.
tags: age, of, ruin, saga, story, quest, termina, temple
*/
// Port of Scripts/Story/AgeOfRuin/01TerminaTemple.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class TerminaTemple {}

export default function main(): void {
    Core.setOptions();

    AOR.terminaTemple();
    Core.setOptions(false);
}
