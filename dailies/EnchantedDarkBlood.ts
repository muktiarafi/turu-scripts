/*
name: Enchanted Dark Blood
description: This script will complete the daily quest for Enchanted Dark Blood.
tags: daily, dark blood,darkblood,enchanted dark blood,falguard,windren,iaste,iaste armor
*/
// Port of Scripts/Dailies/EnchantedDarkBlood.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class EnchantedDarkBlood {}

export default function main(): void {
    Core.setOptions();

    Daily.enchantedDarkBlood();

    Core.setOptions(false);
}
