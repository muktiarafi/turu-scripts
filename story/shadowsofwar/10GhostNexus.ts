/*
name: Ghost Nexus
description: This will finish the Ghost Nexus quest.
tags: story, quest, shadow-war, ghost-nexus
*/
// Port of Scripts/Story/ShadowsOfWar/10GhostNexus.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class GhostNexus {}

export default function main(): void {
    Core.setOptions();

    SoW.ghostNexus();

    Core.setOptions(false);
}
