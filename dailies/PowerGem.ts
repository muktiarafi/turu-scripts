/*
name: Power Gem Daily
description: Power Gem
tags: daily, power gem
*/
// Port of Scripts/Dailies/PowerGem.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class PowerGem {}

export default function main(): void {
    Core.setOptions();

    Daily.powerGem();

    Core.setOptions(false);
}
