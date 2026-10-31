/*
name: Bright Knight Armor Daily
description: Bright Knight Armor
tags: daily, bright knight armor
*/
// Port of Scripts/Dailies/BrightKnightArmor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class BrightKnightArmor {}

export default function main(): void {
    Core.setOptions();

    Daily.brightKnightArmor();

    Core.setOptions(false);
}
