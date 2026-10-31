/*
name: RepBoost
description: null
tags: null
*/
// Port of Scripts/Other/FreeBoosts/RepBoost.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class RepBoost {}

export default function main(): void {
    Core.bankingBlackList.push("XREPUTATION Boost! (10 min)", "Fishing Dynamite");
    Core.setOptions();

    Farm.getBoost("REP", 9999, true);

    Core.setOptions(false);
}
