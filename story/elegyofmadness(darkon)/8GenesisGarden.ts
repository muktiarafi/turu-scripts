/*
name: Genesis Garden
description: This will finish the Genesis Garden quest.
tags: story, quest, elegy-of-madness, darkon, genesis-garden
*/
// Port of Scripts/Story/ElegyofMadness(Darkon)/8GenesisGarden.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAstravia } from "./CoreAstravia";

const Astravia = new CoreAstravia();

export class CompleteGenesisGarden {}

export default function main(): void {
    Core.setOptions();

    Astravia.genesisGarden();

    Core.setOptions(false);
}
