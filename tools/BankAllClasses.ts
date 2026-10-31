/*
name: Bank All Classes
description: Banks every unequipped class in the inventory.
tags: bank, classes, inventory, utility
*/
// Port of Scripts/Tools/BankAllClasses.cs.

import { bot } from "turu";
import { Core } from "../core/CoreBots";

export class BankAllClasses {
    bankClasses(): void {
        // C# hands the list to EnsureToBank's list overload; Turu's takes one item.
        for (const item of bot.inventory.items.filter((item) => item.category === "Class" && !item.equipped)) {
            bot.inventory.ensureToBank(item.id);
        }
    }
}

export default function main(): void {
    const script = new BankAllClasses();
    Core.setOptions();

    script.bankClasses();

    Core.setOptions(false);
}
