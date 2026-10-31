/*
name: Bright Forest Past
description: This will finish the Bright Forest Past quest.
tags: story, quest, shadow-chaos, bright-forest-past
*/
// Port of Scripts/Story/ShadowsOfChaos/09BrightForestPast.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class BrightForestPast {}

export default function main(): void {
    Core.setOptions();

    coreSoC.brightForestPast();

    Core.setOptions(false);
}
