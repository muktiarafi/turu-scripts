/*
name: Golden Inquisitor Daily
description: Golden Inquisitor
tags: daily, golden inquisitor
*/
// Port of Scripts/Dailies/GoldenInquisitorOfShadowfall.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class GoldenInquisitor {}

export default function main(): void {
    Core.setOptions();

    Daily.goldenInquisitor();

    Core.setOptions(false);
}
