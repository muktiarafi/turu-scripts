/*
name: Skye REP
description: This script will farm Skye reputation to rank 10.
tags: skye, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/SkyeREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreAOR } from "../../story/ageofruin/CoreAOR";

const Farm = new CoreFarms();
const AOR = new CoreAOR();

export class Skye {}

export default function main(): void {
    Core.setOptions();

    AOR.seaVoice();
    Farm.skyeREP();

    Core.setOptions(false);
}
