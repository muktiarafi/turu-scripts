/*
name: Timekeep
description: This will finish the Timekeep quest.
tags: story, quest, shadow-war, timekeep
*/
// Port of Scripts/Story/ShadowsOfWar/17Timekeep.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Timekeep {}

export default function main(): void {
    Core.setOptions();

    SoW.timekeep();

    Core.setOptions(false);
}
