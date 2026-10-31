/*
name: Ruined Crown
description: This will finish the Ruined Crown quest.
tags: story, quest, shadow-war, ruined-crown
*/
// Port of Scripts/Story/ShadowsOfWar/16RuinedCrown.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class RuinedCrown {}

export default function main(): void {
    Core.setOptions();

    SoW.ruinedCrown();

    Core.setOptions(false);
}
