/*
name: Laguna Beach
description: This will finish the Laguna Beach quest.
tags: story, quest, shadow-chaos, laguna-beach
*/
// Port of Scripts/Story/ShadowsOfChaos/03LagunaBeach.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class LagunaBeach {}

export default function main(): void {
    Core.setOptions();

    coreSoC.lagunaBeach();

    Core.setOptions(false);
}
