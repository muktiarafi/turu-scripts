/*
name: Bright Shadow
description: This will finish the Bright Shadow quest.
tags: story, quest, shadow-chaos, bright-shadow
*/
// Port of Scripts/Story/ShadowsOfChaos/06BrightShadow.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class BrightShadow {}

export default function main(): void {
    Core.setOptions();

    coreSoC.brightShadow();

    Core.setOptions(false);
}
