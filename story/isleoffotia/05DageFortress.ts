/*
name: Dage Fortress
description: This will finish the DageFortress quest.
tags: story, quest, isle-of-fotia, dage-fortress
*/
// Port of Scripts/Story/IsleOfFotia/05DageFortress.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "./CoreIsleOfFotia";

const coreIsleOfFotia = new CoreIsleOfFotia();

export class DageFortress {}

export default function main(): void {
    Core.setOptions();

    coreIsleOfFotia.dageFortress();

    Core.setOptions(false);
}
