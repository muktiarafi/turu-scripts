/*
name: ChronoSpan REP
description: This script will farm ChronoSpan reputation to rank 10.
tags: chrono, span, timespace, reputation, rep, rank
*/
// Port of Scripts/Farm/REP/ChronoSpanREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class ChronoSpanREP {}

export default function main(): void {
    Core.setOptions();

    Farm.chronoSpanREP();

    Core.setOptions(false);
}
