/*
name: Berserker Bunny Armor
description: This will finish the quest to obtain the Berserker Bunny Armor.
tags: berserker-bunny-armor, seasonal, easter, BBA
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/BerserkerBunnyArmor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class BerserkerBunnyArmorEaster {
    getBBA(): void {
        if (Core.checkInventory("Berserker Bunny Armor")) {
            return;
        }

        if (!Core.checkInventory("Berserker Bunny Armor")) {
            Core.ensureAccept(236);
            Core.killMonster("greenguardwest", "West12", "Up", "Big Bad Boar", "Were Egg", undefined, { log: false });
            Core.ensureComplete(236);
            bot.wait.forPickup("Berserker Bunny Armor");
        }
    }
}

export default function main(): void {
    const script = new BerserkerBunnyArmorEaster();
    Core.setOptions();

    script.getBBA();

    Core.setOptions(false);
}
