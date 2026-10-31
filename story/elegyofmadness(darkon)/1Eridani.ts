/*
name: Erindani
description: This will finish the Eridani quest.
tags: story, quest, elegy-of-madness, darkon, eridani
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/1Eridani.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteEridani {}

export default function main(): void {
    Core.setOptions();

    Astravia.eridani();

    Core.setOptions(false);
}
