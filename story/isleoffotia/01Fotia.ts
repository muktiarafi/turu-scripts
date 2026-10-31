/*
name: Fotia
description: This will finish the Fotia quest.
tags: story, quest, isle-of-fotia, fotia
*/
// Port of Scripts/Story/IsleOfFotia/01Fotia.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "./CoreIsleOfFotia";

const coreIsleOfFotia = new CoreIsleOfFotia();

export class Fotia {}

export default function main(): void {
    Core.setOptions();

    coreIsleOfFotia.fotia();

    Core.setOptions(false);
}
