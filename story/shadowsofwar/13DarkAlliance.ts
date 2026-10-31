/*
name: Dark Alliance
description: This will finish the Dark Alliance quest.
tags: story, quest, shadow-war, dark-alliance
*/
// Port of Scripts/Story/ShadowsOfWar/13DarkAlliance.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class DarkAlliance {}

export default function main(): void {
    Core.setOptions();

    SoW.darkAlliance();

    Core.setOptions(false);
}
