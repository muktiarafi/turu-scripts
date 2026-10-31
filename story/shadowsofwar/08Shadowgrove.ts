/*
name: Shadow Grove
description: This will finish the Shadowgrove quest.
tags: story, quest, shadow-war, shadowgrove
*/
// Port of Scripts/Story/ShadowsOfWar/08Shadowgrove.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Shadowgrove {}

export default function main(): void {
    Core.setOptions();

    SoW.shadowgrove();

    Core.setOptions(false);
}
