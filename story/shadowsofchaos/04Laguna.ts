/*
name: Laguna
description: This will finish the Laguna quest.
tags: story, quest, shadow-chaos, laguna
*/
// Port of Scripts/Story/ShadowsOfChaos/04Laguna.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoC } from "./CoreSoC";

const coreSoC = new CoreSoC();

export class Laguna {}

export default function main(): void {
    Core.setOptions();

    coreSoC.laguna();

    Core.setOptions(false);
}
