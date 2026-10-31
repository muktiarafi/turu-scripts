/*
name: Styx
description: This will finish the Styx quest.
tags: story, quest, isle-of-fotia, styx
*/
// Port of Scripts/Story/IsleOfFotia/03Styx.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "./CoreIsleOfFotia";

const coreIsleOfFotia = new CoreIsleOfFotia();

export class Styx {}

export default function main(): void {
    Core.setOptions();

    coreIsleOfFotia.styx();

    Core.setOptions(false);
}
