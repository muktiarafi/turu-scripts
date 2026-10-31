/*
name: Tyndarius
description: This will finish the Tyndarius quest.
tags: story, quest, shadow-war, tyndarius
*/
// Port of Scripts/Story/ShadowsOfWar/15Tyndarius.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Tyndarius {}

export default function main(): void {
    Core.setOptions();

    SoW.tyndarius();

    Core.setOptions(false);
}
