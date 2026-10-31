/*
name: Astravia Past
description: This will finish the Astravia Past quest.
tags: story, quest, elegy-of-madness, darkon, astravia, past
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/6AstraviaPast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteAstraviaPast {}

export default function main(): void {
    Core.setOptions();

    Astravia.astraviaPast();

    Core.setOptions(false);
}
