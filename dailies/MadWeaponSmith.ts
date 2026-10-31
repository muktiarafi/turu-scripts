/*
name: Mad Weapon Smith Daily
description: Mad Weapon Smith
tags: daily, mad weapon smith
*/
// Port of Scripts/Dailies/MadWeaponSmith.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class MadWeaponSmith {}

export default function main(): void {
    Core.setOptions();

    Daily.madWeaponSmith();

    Core.setOptions(false);
}
