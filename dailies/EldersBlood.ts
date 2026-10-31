/*
name: Elders Blood Daily
description: Elders Blood
tags: daily, elders blood, nulgath, roentgenium
*/
// Port of Scripts/Dailies/EldersBlood.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class EldersBlood {}

export default function main(): void {
    Core.setOptions();

    Daily.eldersBlood();

    Core.setOptions(false);
}
