/*
name: Vampireof Vokun Daily
description: Does the Vampireof Vokun Daily (not 100% drop)
tags: vampireof vokun, daily
*/
// Port of Scripts/Other/VampireofVokun.cs.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreDailies } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class VampireofVokun {
    getArmor(): void {
        if (Core.checkInventory("Vampire of Vokun")) {
            return;
        }

        Core.addDrop("Vampire of Vokun");
        Core.ensureAccept(3761);
        if (!Core.checkInventory("Burn It Down")) {
            if (!Daily.checkDailyv2(187, ["Burn It Down"])) {
                Core.logger("Daily unavailable.");
                return;
            }
            Core.ensureAccept(187);
            Core.equipClass(ClassType.Farm);
            Core.killMonster("portalundead", "Enter", "Spawn", "*", "Fire Gem");
            Core.ensureComplete(187);
            bot.wait.forPickup("Burn It Down");
        }
        Core.killEscherion("Escherion's Robe");
        Core.ensureComplete(3761);
        bot.wait.forPickup("Vampire of Vokun");

        if (!Core.checkInventory("Vampire of Vokun")) {
            Core.logger("Vampire of Vokun didn't drop, try again tomorrow.");
        }
    }
}

export default function main(): void {
    const script = new VampireofVokun();
    Core.setOptions();

    script.getArmor();

    Core.setOptions(false);
}
