/*
name: TimestreamWar
description: This will finish the TimestreamWar quest.
tags: story, quest, shadow-war, timestream-war
*/
// Port of Scripts/Story/ShadowsOfWar/18TimestreamWar.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoW } from "./CoreSoW";

const SoW = new CoreSoW();

export class TimestreamWar {}

export default function main(): void {
    Core.setOptions();

    SoW.timestreamWar();

    Core.setOptions(false);
}
