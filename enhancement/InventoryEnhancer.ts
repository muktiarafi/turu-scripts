/*
name: Inventory Enhancer
description: This script will enhance all the items in your inventory with optimal enhancements.
tags: inventory, enhance, enh
*/
// Port of Scripts/Enhancement/InventoryEnhancer.cs.

import { bot } from "turu";
import { CoreAdvanced, EnhancementType } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class InventoryEnhancer {
    /** Enhances all non-leveled/non-user-level level enhanced items */
    enhanceInventory(type: EnhancementType = EnhancementType.Lucky): void {
        if (Core.cboBool("DisableAutoEnhance") === true) {
            return;
        }

        const InventoryItems = bot.inventory.items
            .filter(
                (x) =>
                    x.enhancementLevel < bot.player.level &&
                    x.equipSlot !== "None" &&
                    x.equipSlot !== "am" &&
                    x.equipSlot !== "mi" &&
                    x.equipSlot !== "co" &&
                    x.equipSlot !== "pe",
            )
            .map((x) => x.name);

        if (InventoryItems.length === 0) {
            Core.logger("The bot couldn't find any items in your inventory that need enhancing.");
        }
        Adv.enhanceItem([...InventoryItems], type);
    }
}

export default function main(): void {
    const script = new InventoryEnhancer();
    Core.setOptions();

    script.enhanceInventory();

    Core.setOptions(false);
}
