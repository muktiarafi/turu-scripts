/*
name: Complete all Shadows of War
description: This will finish all the Shadows of War story.
tags: story, SOW, shadow-of-war, complete, all, fire avatar, ultra avatar tyndarius, ultra speaker, the first speaker
*/
// Port of Scripts/Story/ShadowsOfWar/00DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class ShadowWarAll {}

export default function main(): void {
    Core.setOptions();

    SoW.completeCoreSoW();

    Core.setOptions(false);
}
