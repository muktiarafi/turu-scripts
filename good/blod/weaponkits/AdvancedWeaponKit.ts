/*
name: Advanced Weapon Kit
description: This script farms the max quantity of Advanced Weapon Kits.
tags: advanced, weapon, kit, BLOD, blinding, light, destiny
*/
// Port of Scripts/Good/BLoD/WeaponKits/AdvancedWeaponKit.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreBLOD } from "../CoreBLOD";

const BLOD = new CoreBLOD();

export class AdvancedWeaponKit {}

export default function main(): void {
    Core.setOptions();

    BLOD.advancedWK(1000);

    Core.setOptions(false);
}
