/*
name: Shadow Flame
description: This will finish the ShadowFlame quest.
tags: story, quest, shadow-war, shadowflame
*/
// Port of Scripts/Story/ShadowsOfWar/20ShadowFlame.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class ShadowFlame {}

export default function main(): void {
    Core.setOptions();

    SoW.shadowFlame();

    Core.setOptions(false);
}
