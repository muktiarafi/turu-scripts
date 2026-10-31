/*
name: The World
description: This will finish the The World quest.
tags: story, quest, elegy-of-madness, darkon, the-world
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/9TheWorld.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteTheWorld {}

export default function main(): void {
    Core.setOptions();

    Astravia.theWorld();

    Core.setOptions(false);
}
