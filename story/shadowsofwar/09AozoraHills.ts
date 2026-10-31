/*
name: Aozora Hills
description: This will finish the Aozora Hills quest.
tags: story, quest, shadow-war, aozora-hills
*/
// Port of Scripts/Story/ShadowsOfWar/09AozoraHills.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class AozoraHills {}

export default function main(): void {
    Core.setOptions();

    SoW.aozoraHills();

    Core.setOptions(false);
}
