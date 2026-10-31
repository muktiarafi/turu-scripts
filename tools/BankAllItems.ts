/*
name: BankAllItems
description: null
tags: null
*/
// Port of Scripts/Tools/BankAllItems.cs.

import { bot, defineScriptOptions, type InventoryItem, option } from "turu";
import { Core } from "../core/CoreBots";

export class BankAllItems {
    bankAll(inventory: boolean, house: boolean, bankNonAc: boolean, blackList: string): void {
        const ProcessItems = (items: InventoryItem[], isHouse: boolean): void => {
            let movedAny = false;

            for (const item of items) {
                if (blackListedItems.has(item.name) || item.equipped || item.equipped || (!bankNonAc && !item.coins)) {
                    continue;
                }

                if (!item.coins && bot.bank.freeSlots === 0) {
                    if (!bankFullLogged) {
                        Core.logger(`${Core.username()}'s Bank is full`);
                        bankFullLogged = true;
                    }
                    continue;
                }

                this.bankItem(item, isHouse, bankNonAc);
                movedAny = true;
            }

            Core.logger(`${isHouse ? "House" : "Inventory"} Items: ${movedAny ? "✅" : "Nothing to bank"}`);
        };
        let bankFullLogged = false;

        const blackListedItems = this.buildBlackList(blackList);

        Core.logger(
            `[${[...blackListedItems].filter((name) => bot.inventory.contains(name)).length}x Bag Spaces used] BlackList: ${[...blackListedItems].join(", ")}`,
        );

        if (inventory) {
            ProcessItems(bot.inventory.items, false);
        }

        if (house) {
            ProcessItems(bot.house.items, true);
        }
    }

    private bankItem(item: InventoryItem, isHouse: boolean, bankNonAc: boolean): void {
        if (item.coins && bankNonAc) {
            if (isHouse) {
                bot.house.ensureToBank(item.id);
            } else {
                bot.inventory.ensureToBank(item.id);
            }

            bot.wait.forPickup(item.name);
            return;
        }

        if (isHouse) {
            Core.toHouseBank(item.id);
        } else {
            Core.toBank(item.id);
        }
    }

    private buildBlackList(blackList: string): Set<string> {
        const set: Set<string> = new Set();

        if (!!blackList?.trim()) {
            for (const item of blackList.split(",")) {
                set.add(item.trim());
            }
        }

        for (const name of [Core.soloClass, Core.farmClass, Core.dodgeClass, Core.bossClass, "Treasure Potion"]) {
            set.add(name);
        }

        Core.farmGear.forEach((x) => set.add(x));
        Core.soloGear.forEach((x) => set.add(x));
        Core.dodgeGear.forEach((x) => set.add(x));
        Core.bossGear.forEach((x) => set.add(x));
        Core.bankingBlackList.forEach((x) => set.add(x));

        return set;
    }
}

export const scriptOptions = defineScriptOptions(
    "BankAllBlackList",
    [
        option.bool("Inventory", "InventoryACBank", "Bank all Ac Inventory Items", true),
        option.bool("House", "HouseACBank", "Bank all Ac House Items", true),
        option.bool("BanknonAc", "BanknonAc", "Bank non-AC items", false),
        option.text(
            "BlackList",
            "BlackList Items",
            "Fill in the items teh bot *shouldn't* bank, split with a , (comma).",
            "",
        ),
    ],
    true,
);

export default function main(): void {
    const script = new BankAllItems();
    Core.setOptions();

    script.bankAll(
        bot.config!.get<boolean>("Inventory"),
        bot.config!.get<boolean>("House"),
        bot.config!.get<boolean>("BanknonAc"),
        bot.config!.get<string>("BlackList") ?? "",
    );

    Core.setOptions(false);
}
