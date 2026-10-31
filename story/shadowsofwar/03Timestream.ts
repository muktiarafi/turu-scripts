/*
name: Timestream
description: This is the third part of the Shadow War story arc. It will take you to the Timestream area and start the quest.
tags: story, quest, shadow-war, timestream
*/
// Port of Scripts/Story/ShadowsOfWar/03Timestream.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class Timestream {}

export default function main(): void {
    Core.setOptions();

    SoW.timestream();

    Core.setOptions(false);
}
