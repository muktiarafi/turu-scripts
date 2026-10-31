/*
name: Shadow War
description: This is the first part of the Shadow War story arc. It will take you to the Shadow War area and start the quest.
tags: story, quest, shadow-war
*/
// Port of Scripts/Story/ShadowsOfWar/01ShadowWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class ShadowWar1 {}

export default function main(): void {
    Core.setOptions();

    SoW.shadowWar();

    Core.setOptions(false);
}
