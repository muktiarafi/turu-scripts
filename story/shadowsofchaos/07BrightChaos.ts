/*
name: Bright Chaos
description: This will finish the Bright Chaos quest.
tags: story, quest, shadow-chaos, bright-chaos
*/
// Port of Scripts/Story/ShadowsOfChaos/07BrightChaos.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class BrightChaos {}

export default function main(): void {
    Core.setOptions();

    coreSoC.brightChaos();

    Core.setOptions(false);
}
