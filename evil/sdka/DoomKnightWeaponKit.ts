/*
name: DoomKnight Weapon Kit
description: This script will farm DoomKnight Weapon Kit.
tags: doomknight, doomknightwk, weapon kit, sdka, evil, corrupt spirit orb, ominous aura, grumpy warhammer
*/
// Port of Scripts/Evil/SDKA/DoomKnightWeaponKit.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSDKA } from "./CoreSDKA";

const SDKA = new CoreSDKA();

export class DoomKnightWeaponKit {}

export default function main(): void {
    Core.setOptions();

    SDKA.doomKnightWK("Ominous Aura", 10000);

    Core.setOptions(false);
}
