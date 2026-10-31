/*
name: Shadow Shroud Daily
description: Shadow Shroud
tags: daily, shadow shroud
*/
// Port of Scripts/Dailies/ShadowShroud.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class ShadowShroud {}

export default function main(): void {
    Core.setOptions();

    Daily.shadowShroud();

    Core.setOptions(false);
}
