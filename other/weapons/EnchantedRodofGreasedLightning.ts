/*
name: EnchantedRodofGreasedLightning
description: null
tags: null
*/
// Port of Scripts/Other/Weapons/EnchantedRodofGreasedLightning.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class EnchantedRodofGreasedLightning {}

export default function main(): void {
    Core.setOptions();

    Core.huntMonster("crashruins", "CluckMoo Idol", "Enchanted Rod of Greased Lightning", undefined, { isTemp: false });

    Core.setOptions(false);
}
