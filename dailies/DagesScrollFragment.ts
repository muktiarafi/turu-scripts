/*
name: Dages Scroll Fragment Daily
description: Dages Scroll Fragment
tags: daily, dages scroll fragment
*/
// Port of Scripts/Dailies/DagesScrollFragment.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class DagesScrollFragment {}

export default function main(): void {
    Core.setOptions();

    Daily.dagesScrollFragment();

    Core.setOptions(false);
}
