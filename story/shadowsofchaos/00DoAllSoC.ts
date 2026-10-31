/*
name: Complete Shadows of Chaos Story
description: This will complete the Shadows of Chaos story arc.
tags: story, quest, shadows-of-chaos, complete, all
*/
// Port of Scripts/Story/ShadowsOfChaos/00DoAllSoC.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class DoAllSoC {}

export default function main(): void {
    Core.setOptions();

    coreSoC.completeCoreSoC();

    Core.setOptions(false);
}
