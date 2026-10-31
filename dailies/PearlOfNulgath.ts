/*
name: Pearl of Nulgath Daily
description: Gets the pearl of nulgath from the daily quest.
tags: daily, pearl of nulgath,pearl,malakai,contract enforcer
*/
// Port of Scripts/Dailies/PearlOfNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class PearlOfNulgath {}

export default function main(): void {
    Core.setOptions();

    Daily.pearlOfNulgath();

    Core.setOptions(false);
}
