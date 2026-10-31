/*
name: Basic Weapon Kit
description: This script farms the max quantity of Basic Weapon Kits.
tags: basic, weapon, kit, BLOD, blinding, light, destiny
*/
// Port of Scripts/Good/BLoD/WeaponKits/BasicWeaponKits.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreBLOD } from "../CoreBLOD";

const BLOD = new CoreBLOD();

export class BasicWeaponKits {}

export default function main(): void {
    Core.setOptions();

    BLOD.basicWK(1000);

    Core.setOptions(false);
}
