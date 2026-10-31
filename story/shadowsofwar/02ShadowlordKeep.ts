/*
name: Shadowlord Keep
description: This is the second part of the Shadow War story arc. It will take you to the Shadowlord Keep area and start the quest.
tags: story, quest, shadow-war, shadowlord-keep
*/
// Port of Scripts/Story/ShadowsOfWar/02ShadowlordKeep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class ShadowlordKeep {}

export default function main(): void {
    Core.setOptions();

    SoW.shadowlordKeep();

    Core.setOptions(false);
}
