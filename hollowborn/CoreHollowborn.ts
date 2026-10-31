/*
name: null
description: null
tags: null
*/
// Port of Scripts/Hollowborn/CoreHollowborn.cs.
// Not ported (FarmerJoe's DoAll doesn't reach them): HardcoreContract, HumanSoul, HBLycanClaw, HBVampireFang, HBHollowbornResidue, HBWrit.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();

export class CoreHollowborn {
    freshSouls(Uni36Quant = 3, FSQuant = 1000): void {
        if (Core.checkInventory("Unidentified 36", Uni36Quant) && Core.checkInventory("Fresh Soul", FSQuant)) return;

        Farm.experience(50);

        Core.addDrop("Unidentified 36");
        // "Fresh Soul"
        Core.addDrop(52588);
        Core.registerQuests(7293);

        if (FSQuant > 0) Core.farmingLogger("Fresh Soul", FSQuant);
        if (Uni36Quant > 0) Core.farmingLogger("Unidentified 36", Uni36Quant);

        while (
            !bot.shouldExit &&
            (!Core.checkInventory("Unidentified 36", Uni36Quant) || !Core.checkInventory(52588, FSQuant))
        ) {
            Core.huntMonster("citadel", "Inquisitor Guard", "Fresh Soul?", 10, { log: false });
            bot.wait.forPickup(52588);
        }
        Core.cancelRegisteredQuests();
    }

    hardcoreContract(): void {
        if (Core.checkInventory(55157)) {
            return;
        }

        Core.addDrop("Human Soul", "Fallen Soul", "Lae\'s Hardcore Contract");
        Farm.experience(65);

        Core.logger("Getting Lae's Hardcore Contract");
        Core.ensureAccept(7556);

        if (!Core.checkInventory("Soul Potion")) {
            Farm.gold(2500000);
            Core.buyItem("alchemyacademy", 2036, "Gold Voucher 500k", 5);
            Core.buyItem("alchemyacademy", 2036, "Soul Potion");
            bot.wait.forItemBuy();
        }

        this.humanSoul(50);

        Core.equipClass(ClassType.Solo);
        Core.killMonster("doomwood", "r10", "right", "Undead Paladin", "Fallen Soul", 13, { isTemp: false });

        Core.ensureComplete(7556);
    }

    humanSoul(quant = 300): void {
        if (Core.checkInventory("Human Soul", quant)) {
            return;
        }

        Core.addDrop("Human Soul");

        Core.equipClass(ClassType.Farm);
        Core.killMonster("noxustower", "r13", "Left", "*", "Human Soul", quant, { isTemp: false });
    }
}
