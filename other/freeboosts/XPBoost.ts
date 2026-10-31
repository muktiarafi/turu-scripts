/*
name: XPBoost
description: null
tags: null
*/
// Port of Scripts/Other/FreeBoosts/XPBoost.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class XpBoost {}

export default function main(): void {
    Core.bankingBlackList.push("XP Boost! (10 min)", "Fishing Dynamite");
    Core.setOptions();

    Farm.getBoost("XP", 9999, true);

    Core.setOptions(false);
}
