/*
name: Treasure Chest Keys Daily
description: reasure Chest Keys
tags: monthly, treasure chest keys, member
*/
// Port of Scripts/Dailies/MonthlyTreasureChestKeys[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class MonthlyTreasureChestKeys {}

export default function main(): void {
    Core.setOptions();

    Daily.monthlyTreasureChestKeys();

    Core.setOptions(false);
}
