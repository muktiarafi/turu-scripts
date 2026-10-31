/*
name: Cyseros Super Hammer Daily
description: Cyseros Super Hammer
tags: daily, cyseros super hammer
*/
// Port of Scripts/Dailies/CyserosSuperHammer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class CyserosSuperHammer {}

export default function main(): void {
    Core.setOptions();

    Daily.cyserosSuperHammer();

    Core.setOptions(false);
}
