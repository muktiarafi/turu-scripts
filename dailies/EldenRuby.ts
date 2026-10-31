/*
name: Elden Ruby
description: This script will complete the daily quest for Elden Ruby.
tags: daily, eldenruby,ruby, shadowrealm, blood-dyed stones, shadow realm
*/
// Port of Scripts/Dailies/EldenRuby.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class EldenRuby {}

export default function main(): void {
    Core.setOptions();

    Daily.eldenRuby();

    Core.setOptions(false);
}
