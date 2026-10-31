/*
name: Weapon Reflection
description: Farms "Weapon Reflection" From Quest: "Dual Wield Forge".
tags: weapon reflection, dual wield forge, golden 8th birthday candle
*/
// Port of Scripts/Other/WeaponReflection.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";

export class DualWield {
    weaponReflection(quant = 200): void {
        if (Core.checkInventory("Weapon Reflection", quant)) {
            return;
        }

        Core.logger("Checking if Your Acc is 8 Years Old");

        Core.buyItem(bot.map.name, 1317, "Golden 8th Birthday Candle");
        if (!Core.checkInventory("Golden 8th Birthday Candle")) {
            Core.logger("your acc isn't old enough.");
            return;
        }

        Core.addDrop("Weapon Reflection");
        while (!bot.shouldExit && !Core.checkInventory("Weapon Reflection", quant)) {
            Core.ensureAccept(5518);
            Core.huntMonster("nostalgiaquest", "Skeletal Viking", "Reflected Glory", 5);
            Core.huntMonster("nostalgiaquest", "Skeletal Warrior", "Divided Light", 5);
            Core.ensureComplete(5518);
            bot.wait.forPickup("Weapon Reflection");
        }
    }
}

export default function main(): void {
    const script = new DualWield();
    Core.setOptions();

    script.weaponReflection();

    Core.setOptions(false);
}
