/*
name: Judgement
description: This will finish the Judgement quest.
tags: story, quest, isle-of-fotia, judgement
*/
// Port of Scripts/Story/IsleOfFotia/04Judgement.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "./CoreIsleOfFotia";

const coreIsleOfFotia = new CoreIsleOfFotia();

export class Judgement {}

export default function main(): void {
    Core.setOptions();

    coreIsleOfFotia.judgement();

    Core.setOptions(false);
}
