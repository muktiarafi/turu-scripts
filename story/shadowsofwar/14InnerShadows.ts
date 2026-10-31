/*
name: Inner Shadows
description: This will finish the Inner Shadows quest.
tags: story, quest, shadow-war, inner-shadows
*/
// Port of Scripts/Story/ShadowsOfWar/14InnerShadows.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class InnerShadows {}

export default function main(): void {
    Core.setOptions();

    SoW.innerShadows();

    Core.setOptions(false);
}
