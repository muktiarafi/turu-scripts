/*
name: Nation Loyalty Rewarded
description: Does the Nation Loyalty Rewarded Quest to max the quest rewards.
tags: nation loyalty rewarded, nulgath, nation, dark crystal shard, diamond of nulgath, diamond badge of nulgath
*/
// Port of Scripts/Nation/NationLoyaltyRewarded.cs.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class NationLoyaltyRewarded {
    farmQuest(farmItems: string[] | null = null, quantity = 0): void {
        const quest = Core.ensureLoad(4749);
        const rewards = quest?.rewards;

        if (farmItems == null || farmItems.length === 0) {
            // Process all items
            if (rewards != null && rewards.length > 0) {
                for (const item of rewards.filter((x) => x != null)) {
                    const targetQty =
                        quantity === 0 ? (rewards.find((x) => x?.name === item?.name)?.maxStack ?? 0) : quantity;

                    if (!!item?.name?.trim()) {
                        this.nlr([item.name], targetQty);
                    }
                }
            } else {
                Core.logger("No rewards found for quest 4749. Skipping FarmQuest.");
            }
        } else {
            // Add rewards to drop list
            Core.addDrop(...farmItems.filter((x) => !!x?.trim()));

            // Required items to start quest
            Nation.nationRound4Medal();
            Nation.farmUni13(1);

            // Process each specified item
            for (const farmItem of farmItems) {
                if (!farmItem?.trim()) {
                    continue;
                }

                const reward = Core.initializeWithRetries(() => rewards?.find((x) => x?.name === farmItem) ?? null);
                if (reward == null) {
                    Core.logger(`Reward '${farmItem}' not found in quest 4749.`);
                    continue;
                }

                if (bot.inventory.isMaxStack(reward.id)) {
                    continue;
                }

                const targetQty = quantity === 0 ? reward.maxStack : quantity;
                this.nlr([farmItem], targetQty);
            }
        }
    }

    nlr(items: string[] | null = null, quantity = 1): void {
        if (
            items == null ||
            items.length === 0 ||
            items.every((item) => !item?.trim() || Core.checkInventory(item, quantity))
        ) {
            Core.logger(
                items == null || items.length === 0
                    ? "Items parameter is null or empty, skipping NLR."
                    : `${items.filter((x) => !!x?.trim()).join(", ")} x${quantity} already in inventory. Skipping...`,
            );
            return;
        }

        for (const item of items.filter((x) => !!x?.trim())) {
            Core.farmingLogger(item!, quantity);
        }

        Core.equipClass(ClassType.Solo);

        // Nation Loyalty Rewarded quest (ID: 4749)
        while (!bot.shouldExit && items.some((item) => !!item?.trim() && !Core.checkInventory(item, quantity))) {
            Core.ensureAccept(4749);

            Core.killMonster("dflesson", "r12", "Right", 29, 33257);
            Core.huntMonster("aqlesson", "Carnax", "Carnax Eye");
            Core.huntMonster("deepchaos", "Kathool", "Kathool Tentacle");
            Core.huntMonster("lair", "Red Dragon", "Red Dragon's Fang");
            Core.huntMonster("bloodtitan", "Blood Titan", "Blood Titan's Blade");

            Core.equipClass(ClassType.Farm);
            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Defeated Makai", 25, { isTemp: false });

            for (const item of items.filter((x) => !!x?.trim())) {
                bot.wait.forPickup(item!);
            }

            Core.ensureComplete(4749);
        }
    }
}

export default function main(): void {
    const script = new NationLoyaltyRewarded();
    const quest = Core.ensureLoad(4749);
    // C# blacklists `item.ToString()` ("[ID]\t(Item) Name x1"), which no item name matches, so
    // the quest's items were banked anyway; the names are blacklisted here.
    Core.bankingBlackList.push(
        ...quest.rewards.map((item) => item.name),
        ...quest.acceptRequirements.map((item) => item.name),
    );

    Core.setOptions();
    script.farmQuest(
        quest.rewards
            ?.map((x) => x?.name)
            .filter((x) => !!x?.trim())
            .map((x) => x!),
    );

    Core.setOptions(false);
}
