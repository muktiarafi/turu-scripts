/*
name: First Observatory
description: This will finish the First Observatory quest.
tags: story, quest, elegy-of-madness, darkon, first-observatory
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/7FirstObservatory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteFirstObservatory {}

export default function main(): void {
    Core.setOptions();

    Astravia.firstObservatory();

    Core.setOptions(false);
}
