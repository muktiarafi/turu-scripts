/*
name: Dual Plane
description: This will finish the Dual Plane quest.
tags: story, quest, shadow-chaos, dual-plane
*/
// Port of Scripts/Story/ShadowsOfChaos/01DualPlane.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class DualPlane {}

export default function main(): void {
    Core.setOptions();

    coreSoC.dualPlane();

    Core.setOptions(false);
}
