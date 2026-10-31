/*
name: Gathering Unstable Essences
description: farms void auras via the "gathering unstable essences" quest.
tags: gathering, unstable, essences, void aura
*/
// Port of Scripts/Evil/NSoD/VoidAuras/GatheringUnstableEssences.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreNSOD } from "../CoreNSOD";

const NSoD = new CoreNSOD();

export class GatheringUnstableEssences {}

export default function main(): void {
    Core.setOptions();

    NSoD.gatheringUnstableEssences();

    Core.setOptions(false);
}
