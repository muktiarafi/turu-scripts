/*
name: Dark Ally
description: This will finish the Dark Ally quest.
tags: story, quest, shadow-war, dark-ally
*/
// Port of Scripts/Story/ShadowsOfWar/12DarkAlly.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class DarkAlly {}

export default function main(): void {
    Core.setOptions();

    SoW.darkAlly();

    Core.setOptions(false);
}
