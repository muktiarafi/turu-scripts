/*
name: Complete Isle Of Fotia Story
description: This will complete the Isle Of Fotia story.
tags: story, quest, isle-of-fotia, complete, all
*/
// Port of Scripts/Story/IsleOfFotia/00DoAllIsleOfFotia.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "./CoreIsleOfFotia";

const coreIsleOfFotia = new CoreIsleOfFotia();

export class DoAllIsleOfFotia {}

export default function main(): void {
    Core.setOptions();

    coreIsleOfFotia.completeALL();

    Core.setOptions(false);
}
