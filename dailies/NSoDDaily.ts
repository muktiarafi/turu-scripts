/*
name: Necrotic Sword of Doom Daily
description: This bot will do the Encroaching Shadows quest plus Glimpse Into the Dark if you're member.
tags: daily, NSOD, necrotic, sword, doom, encroaching, shadows, void, aura
*/
// Port of Scripts/Dailies/NSoDDaily.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class NSODDaily {}

export default function main(): void {
    Core.setOptions();

    Daily.nSoDDaily();

    Core.setOptions(false);
}
