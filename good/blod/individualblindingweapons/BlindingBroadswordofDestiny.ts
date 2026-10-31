/*
name: BlindingBroadswordofDestiny
description: This bot will do the entire farm for the Blinding Broadsword of Destiny *Note*: it uses dailies!
tags: BLOD, blinding, broadsword, destiny, undead, 75, damage, good, soul searching, minecrafting, metals, spirit orb, aura, loyal, blinding, bright, brilliant, weapon kit, finding fragments, bone some dust, essential essences, light merge, blinding light fragments, Blinding Broadsword of Destiny
*/
// Port of Scripts/Good/BLoD/IndividualBlindingWeapons/BlindingBroadswordofDestiny.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreBLOD, WeaponOfDestiny } from "../CoreBLOD";

const BLOD = new CoreBLOD();

export class BlindingBroadswordofDestiny {}

export default function main(): void {
    Core.setOptions();

    BLOD.getBlindingWeapon(WeaponOfDestiny.Broadsword);

    Core.setOptions(false);
}
