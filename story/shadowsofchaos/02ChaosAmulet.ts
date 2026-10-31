/*
name: Chaos Amulet
description: This will finish the Chaos Amulet quest.
tags: story, quest, shadow-chaos, chaos-amulet
*/
// Port of Scripts/Story/ShadowsOfChaos/02ChaosAmulet.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class ChaosAmulet {}

export default function main(): void {
    Core.setOptions();

    coreSoC.chaosAmulet();

    Core.setOptions(false);
}
