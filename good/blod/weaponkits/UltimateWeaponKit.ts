/*
name: Ultimate Weapon Kit
description: This script farms the max quantity of Ultimate Weapon Kits.
tags: ultimate, weapon, kit, BLOD, blinding, light, destiny
*/
// Port of Scripts/Good/BLoD/WeaponKits/UltimateWeaponKit.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreBLOD } from "../CoreBLOD";

const BLOD = new CoreBLOD();

export class UltimateWeaponKit {}

export default function main(): void {
    Core.setOptions();

    BLOD.ultimateWK(undefined, 10000);

    Core.setOptions(false);
}
