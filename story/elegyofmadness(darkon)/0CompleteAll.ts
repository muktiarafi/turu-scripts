/*
name: Complete Elegy of Madness Story
description: This will complete the Astravia story.
tags: story, quest, elegy-of-madness, darkon, complete, all, astravia
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/0CompleteAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteAstravia {}

export default function main(): void {
    Core.setOptions();

    Astravia.completeCoreAstravia();

    Core.setOptions(false);
}
