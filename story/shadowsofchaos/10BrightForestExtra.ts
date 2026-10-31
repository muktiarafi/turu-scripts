/*
name: Bright Forest Extra
description: This will finish the Bright Forest Extra quest.
tags: story, quest, shadow-chaos, bright-forest-extra
*/
// Port of Scripts/Story/ShadowsOfChaos/10BrightForestExtra.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class BrightForestExtra {}

export default function main(): void {
    Core.setOptions();

    coreSoC.brightForestExtra();

    Core.setOptions(false);
}
