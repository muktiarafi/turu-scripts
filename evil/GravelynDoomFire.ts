/*
name: Gravelyn's DoomFire Token
description: This script will get items from Gravelyn's DoomFire shop.
tags: gravelyn, doomfire, token, doomfire of gravelyn, horned doomfire helm, evil
*/
// Port of Scripts/Evil/GravelynDoomFire.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../core/CoreBots";
import { CoreFarms } from "../core/CoreFarms";

const Farm = new CoreFarms();

export class GravelynDoomFire {
    gravelynsDoomFireTokenItems: string[] = [
        "Empowered Essence",
        "Gravelyn's Blessing",
        "Painful Memory Bubble",
        "Burning Passion Flame",
        "Father's Sorrowful Tear",
    ];

    buyItems(): void {
        // Items to buy from the shop
        const shopItems = ["DOOMFire OF Gravelyn", "Horned DOOMFire Helm"];

        // If we already have the shop items, return
        if (Core.checkInventory(shopItems)) {
            return;
        }

        // Add the drop items to inventory
        Core.addDrop(...[...this.gravelynsDoomFireTokenItems, ...shopItems]);

        while (!bot.shouldExit && !Core.checkInventory(shopItems)) {
            // Check for "Gravelyn's DoomFire Token"
            if (!Core.checkInventory(37033)) {
                // Check for "Gravelyn's Blessing"
                if (!Core.checkInventory(37034)) {
                    if (Core.checkInventory("Necrotic Sword of Doom")) {
                        Core.chainComplete(5455);
                    } else if (Core.checkInventory("Sepulchure's DoomKnight Armor")) {
                        Core.chainComplete(5456);
                    } else {
                        // Handle the case when none of the above conditions match
                        Farm.evilREP(10);
                        Core.ensureAccept(5457);
                        Core.huntMonsterMapID("necrodungeon", 9, "Essence of the Doomlord");
                        Core.ensureComplete(5457);
                        bot.wait.forPickup(37034);
                    }
                }

                // Check for "Painful Memory Bubble"
                if (!Core.checkInventory("Painful Memory Bubble")) {
                    Core.ensureAcceptmultiple(5458, 5459, 5460, 5461);
                    Core.killMonster("swordhavenfalls", "r10", "Left", 1, "Doomed Memories");
                    Core.ensureComplete(5458);
                    bot.wait.forPickup("Painful Memory Bubble");
                }

                // Check for "Burning Passion Flame"
                if (!Core.checkInventory("Burning Passion Flame")) {
                    Core.huntMonster("shadowstrike", "Sepulchuroth", "Sepulchuroth's Undying Flame");
                    Core.ensureComplete(5459);
                    bot.wait.forPickup("Burning Passion Flame");
                }

                // Check for "Father's Sorrowful Tear"
                if (!Core.checkInventory("Father's Sorrowful Tear")) {
                    Core.huntMonster("Shadowfall", "Shadow of the Past", "Father's Anger");
                    Core.ensureComplete(5460);
                    bot.wait.forPickup("Father's Sorrowful Tear");
                }

                // Kill monsters for "Empowered Essence"
                Core.killMonster("shadowrealmpast", "Enter", "Spawn", "*", "Empowered Essence", 13, { isTemp: false });

                // Ensure completion of the main quest
                if (
                    this.gravelynsDoomFireTokenItems.slice(0, 6).every((item) => Core.checkInventory(item)) &&
                    Core.checkInventory("Empowered Essence", 13)
                ) {
                    Core.ensureComplete(5461);
                }
                bot.wait.forPickup(37033);
            }

            // Buy missing shop items and send them to the bank
            for (const item of shopItems) {
                if (!Core.checkInventory(item) && Core.checkInventory(37033)) {
                    Core.buyItem("darkthronehub", 1307, item);
                } else {
                    break;
                }
            }

            Core.toBank(...shopItems);
        }
    }
}

export default function main(): void {
    const script = new GravelynDoomFire();
    Core.setOptions();

    script.buyItems();

    Core.setOptions(false);
}
