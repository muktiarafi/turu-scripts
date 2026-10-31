/*
name: Dreadrock REP
description: This script will farm Dreadrock reputation to rank 10.
tags: dreadrock, dread, rock, reputation, rep, rank
*/
// Port of Scripts/Farm/REP/DreadrockREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class DreadrockREP {}

export default function main(): void {
    Core.setOptions();

    Farm.dreadrockREP();

    Core.setOptions(false);
}
