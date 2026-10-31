/*
name: Astravia Castle
description: This will finish the Astravia Castle quest.
tags: story, quest, elegy-of-madness, darkon, astravia, castle
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/3AstraviaCastle.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteAstraviaCastle {}

export default function main(): void {
    Core.setOptions();

    Astravia.astraviaCastle();

    Core.setOptions(false);
}
