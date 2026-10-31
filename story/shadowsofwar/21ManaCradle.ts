/*
name: Mana Cradle
description: This will finish the Mana Cradle quests.
tags: story, quest, shadow-war, mana cradle,ultra speaker,ultraspeaker,malgor,manacradle
*/
// Port of Scripts/Story/ShadowsOfWar/21ManaCradle.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class ManaCradle {}

export default function main(): void {
    Core.setOptions();

    SoW.manaCradle();

    Core.setOptions(false);
}
