/*
name: Bright Forest
description: This will finish the Bright Forest quest.
tags: story, quest, shadow-chaos, bright-forest
*/
// Port of Scripts/Story/ShadowsOfChaos/08BrightForest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class BrightForest {}

export default function main(): void {
    Core.setOptions();

    coreSoC.brightForest();

    Core.setOptions(false);
}
