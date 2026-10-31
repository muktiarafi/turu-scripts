/*
name: Snowy Vale Story
description: This script completes the SnowyVale quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,snowyvale
*/
// Port of Scripts/Seasonal/Frostvale/Story/04SnowyVale.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class SnowyVale {}

export default function main(): void {
    Core.setOptions();

    Frost.snowyVale();
    Core.setOptions(false);
}
