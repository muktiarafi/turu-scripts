/*
name: Eridani Past
description: This will finish the Eridani Past quest.
tags: story, quest, elegy-of-madness, darkon, eridani-past
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/5EridaniPast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteEridaniPast {}

export default function main(): void {
    Core.setOptions();

    Astravia.eridaniPast();

    Core.setOptions(false);
}
