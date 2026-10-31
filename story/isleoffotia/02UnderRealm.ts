/*
name: UnderRealm
description: This will finish the UnderRealm quest.
tags: story, quest, isle-of-fotia, underrealm
*/
// Port of Scripts/Story/IsleOfFotia/02UnderRealm.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreIsleOfFotia } from "./CoreIsleOfFotia";

const coreIsleOfFotia = new CoreIsleOfFotia();

export class UnderRealm {}

export default function main(): void {
    Core.setOptions();

    coreIsleOfFotia.underRealm();

    Core.setOptions(false);
}
