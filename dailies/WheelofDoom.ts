/*
name: Wheel of Doom Daily
description: Wheel of Doom
tags: daily, wheel of doom
*/
// Port of Scripts/Dailies/WheelofDoom.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class WheelofDoom {}

export default function main(): void {
    Core.setOptions();

    Daily.wheelofDoom();

    Core.setOptions(false);
}
