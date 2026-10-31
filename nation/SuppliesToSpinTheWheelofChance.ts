/*
name: SuppliesToSpinTheWheelofChance
description: Do "Supplies to Spin the Wheel" [*or* swindles bilk quests if u have it avaible.]
tags: swindles return policy, supplies to spin the wheel, swindles bilk, the assistant, nulgath, nation, supplies, Ultra Chaos Alteon, escherion
*/
// Port of Scripts/Nation/SuppliesToSpinTheWheelofChance.cs.

import { bot, choices, defineScriptOptions, option, type Quest, type QuestItem } from "turu";
import { Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

export enum SwindlesReturnItem {
    All = "All",
    Tainted_Gem = "Tainted_Gem",
    Dark_Crystal_Shard = "Dark_Crystal_Shard",
    Diamond_of_Nulgath = "Diamond_of_Nulgath",
    Gem_of_Nulgath = "Gem_of_Nulgath",
    Blood_Gem_of_the_Archfiend = "Blood_Gem_of_the_Archfiend",
    Receipt_of_Swindle = "Receipt_of_Swindle",
}

export enum SuppliesReward {
    All = "All",
    Tainted_Gem = "Tainted_Gem",
    Dark_Crystal_Shard = "Dark_Crystal_Shard",
    Diamond_of_Nulgath = "Diamond_of_Nulgath",
    Voucher_of_Nulgath = "Voucher_of_Nulgath",
    Voucher_of_Nulgath_NonMem = "Voucher_of_Nulgath_NonMem",
    Gem_of_Nulgath = "Gem_of_Nulgath",
    Unidentified_10 = "Unidentified_10",
    Essence_of_Nulgath = "Essence_of_Nulgath",
}

export class SuppliesToSpinTheWheelofChance {
    static get nation(): CoreNation {
        return (SuppliesToSpinTheWheelofChance._Nation ??= new CoreNation());
    }
    static set nation(value: CoreNation) {
        SuppliesToSpinTheWheelofChance._Nation = value;
    }
    private static _Nation: CoreNation = null!;

    doSupplies(): void {
        const [swindlesReturnItem, maxSwindles] = this.getNormalizedConfigItem("SwindlesReturnItem");
        const [suppliesItem, maxSupplies] = this.getNormalizedConfigItem("SuppliesReward");

        const supplies = this.loadQuestWithRetry(2857, "Supplies");
        const swindlesReturn = this.loadQuestWithRetry(7551, "Swindle's Return");

        if (supplies == null || swindlesReturn == null) {
            Core.logger("Exiting - failed to load required quests (bot stopped).");
            return;
        }

        const combinedRewards = this.buildCombinedRewardsList(supplies, swindlesReturn);
        this.logSuppliesConfiguration(combinedRewards, maxSupplies, maxSwindles);

        this.processRewards(combinedRewards, supplies, swindlesReturn, suppliesItem, swindlesReturnItem);
    }

    /** The item the option names, and whether it's "All" (C# returns that by `out`). */
    private getNormalizedConfigItem(configKey: string): [item: string | null, isMaxAll: boolean] {
        const item = bot.config.get<string>(configKey)?.toString();
        const isMaxAll = item === "All";
        if (isMaxAll) {
            return [null, isMaxAll];
        }

        return [
            item === "Voucher_of_Nulgath_NonMem"
                ? "Voucher of Nulgath (non-mem)"
                : (item?.replaceAll("_", " ") ?? null),
            isMaxAll,
        ];
    }

    private loadQuestWithRetry(questId: number, questName: string): Quest | null {
        while (!bot.shouldExit) {
            const quest = Core.initializeWithRetries(() => bot.quests.ensureLoad(questId));
            if (quest != null) {
                return quest;
            }

            Core.logger(`Failed to load quest ${questId} (${questName}). Retrying...`);
            Core.sleep();
        }
        return null;
    }

    private buildCombinedRewardsList(supplies: Quest, swindlesReturn: Quest): QuestItem[] {
        const combinedRewards: QuestItem[] = [];

        // Add unique Supplies rewards (excluding maxed items)
        combinedRewards.push(
            ...supplies.rewards
                .filter(
                    (r) =>
                        r != null &&
                        SuppliesToSpinTheWheelofChance.nation.suppliesRewards.includes(r.name) &&
                        !Core.checkInventory(r.id, r.maxStack),
                )
                .filter((x, i, all) => all.findIndex((y) => y.id === x.id) === i),
        );

        // Add unique Swindle's Return rewards (excluding maxed items)
        combinedRewards.push(
            ...swindlesReturn.rewards
                .filter(
                    (r) =>
                        r != null &&
                        SuppliesToSpinTheWheelofChance.nation.swindlesReturnRewards.includes(r.name) &&
                        !Core.checkInventory(r.id, r.maxStack),
                )
                .filter((x, i, all) => all.findIndex((y) => y.id === x.id) === i),
        );

        return combinedRewards.filter((x, i, all) => all.findIndex((y) => y.id === x.id) === i);
    }

    private logSuppliesConfiguration(rewards: QuestItem[], maxSupplies: boolean, maxSwindles: boolean): void {
        const Flag = (v: boolean): string => {
            return v ? "✓" : "✗";
        };
        const rewardNames = rewards.map((r) => r.name).join(", ");
        Core.logger(
            `(STStW) Rewards: ${rewardNames}\n` + `Supplies: ${Flag(maxSupplies)} | Swindles: ${Flag(maxSwindles)}`,
            "STStW Config",
        );
    }

    private processRewards(
        combinedRewards: QuestItem[],
        supplies: Quest,
        swindlesReturn: Quest,
        suppliesItem: string | null,
        swindlesReturnItem: string | null,
    ): void {
        for (const item of combinedRewards) {
            if (Core.checkInventory(item.id, item.maxStack)) {
                Core.logger(`Skipping ${item.name} - already at max stack (${item.maxStack})`);
                continue;
            }

            Core.farmingLogger(item.name, item.maxStack);

            // Clear out targets that have since become maxed so a new one gets picked
            if (
                suppliesItem != null &&
                Core.checkInventory(suppliesItem, this.getRewardMaxStack(supplies, suppliesItem))
            ) {
                suppliesItem = null;
            }

            if (
                swindlesReturnItem != null &&
                Core.checkInventory(swindlesReturnItem, this.getRewardMaxStack(swindlesReturn, swindlesReturnItem))
            ) {
                swindlesReturnItem = null;
            }

            swindlesReturnItem ??= this.getNextNonMaxedReward(
                swindlesReturn,
                SuppliesToSpinTheWheelofChance.nation.swindlesReturnRewards,
            );
            suppliesItem ??= this.getNextNonMaxedReward(
                supplies,
                SuppliesToSpinTheWheelofChance.nation.suppliesRewards,
            );

            // Fallback with deterministic logic
            const currentSuppliesItem =
                suppliesItem ??
                (SuppliesToSpinTheWheelofChance.nation.suppliesRewards.includes(item.name) ? item.name : null);

            const currentSwindlesItem =
                swindlesReturnItem ??
                (SuppliesToSpinTheWheelofChance.nation.swindlesReturnRewards.includes(item.name) ? item.name : null);

            if (currentSuppliesItem == null) {
                Core.logger("All Supplies items are maxed");
            }

            if (currentSwindlesItem == null) {
                Core.logger("All Swindle's Return items are maxed - Return Policy will be disabled");
            }

            // Get max stacks only for valid items
            const suppliesMaxStack =
                currentSuppliesItem != null ? this.getRewardMaxStack(supplies, currentSuppliesItem) : 0;

            // Core.Logger($"Target - Supplies: {currentSuppliesItem ?? "None"} x{suppliesMaxStack}, Swindle's Return: {currentSwindlesItem ?? "None"} x{swindlesMaxStack}");

            const returnPolicyActive =
                Core.cboBool("Nation_ReturnPolicyDuringSupplies") === true && currentSwindlesItem != null;

            SuppliesToSpinTheWheelofChance.nation.supplies(currentSuppliesItem, suppliesMaxStack, {
                ultraAlteon: bot.config!.get<boolean>("UltraAlteon"),
                keepVoucher: bot.config!.get<boolean>("KeepVoucher"),
                assistantDuring: bot.config!.get<boolean>("AssistantDuring"),
                returnItem: currentSwindlesItem,
                returnPolicyDuringSupplies: returnPolicyActive,
                voucherItemDuring: bot.config!.get<boolean>("VoucherItemQuestDuring"),
                hydraChallenge: bot.config!.get<boolean>("HydraChallenge"),
            });
        }
    }
    private getNextNonMaxedReward(quest: Quest, validRewards: string[]): string | null {
        if (quest?.rewards == null) {
            Core.logger(`Quest rewards are null for quest ${quest?.id ?? 0}`);
            return null;
        }

        const allItems = bot.inventory.items.concat(...bot.bank.items);

        return (
            quest.rewards
                .filter(
                    (r) =>
                        r != null &&
                        validRewards.includes(r.name) &&
                        !allItems.some((i) => i.id === r.id && i.quantity >= r.maxStack),
                )
                .map((r) => r.name)[0] ?? null
        );
    }

    private getRewardMaxStack(quest: Quest, itemName: string): number {
        const reward = quest.rewards?.find((x) => x != null && x.name === itemName) ?? null;
        const maxStack = reward?.maxStack ?? 0;

        if (maxStack === 0) {
            Core.logger(`Warning: Could not find max stack for '${itemName}' in quest ${quest.id}`);
        }

        return maxStack;
    }
}

export const scriptOptions = defineScriptOptions(
    "SuppliesOptions",
    [
        Core.skipOptions,
        option.choice(
            "SwindlesReturnItem",
            "SwindlesReturnItem",
            'pick the reward for the "Swindles Return" Quest',
            choices(SwindlesReturnItem),
            SwindlesReturnItem.All,
        ),
        option.choice(
            "SuppliesReward",
            "SuppliesReward",
            'pick the reward for the "Supplies to spin the wheel" Quest',
            choices(SuppliesReward),
            SuppliesReward.All,
        ),
        option.bool(
            "AssistantDuring",
            'Do: "The Assistant" during?',
            "Do the quest: [The Assistant], (requires alota gold, that you will get from the vouchers of nulgath (mem)) during this.",
            false,
        ),
        option.bool(
            "UltraAlteon",
            'Kill "UltraAlteon"',
            'Instead of "Escherion" or bamboozle, do "Ultra Chaos Alteon"?',
            false,
        ),
        option.bool(
            "HydraChallenge",
            'Kill "Hydra Head 90" in /hydrachallenge',
            "Farm Relic of Chaos in the level 90 Hydra room in /hydrachallenge",
            false,
        ), // add option for Voucher Item: Totem of Nulgath During
        option.bool(
            "VoucherItemQuestDuring",
            "Do `Voucher Item: Totem of Nulgath` During?",
            "Do Voucher Item: Totem of Nulgath During?",
            false,
        ),
        option.bool("KeepVoucher", "Keep Voucher?", "Keep Voucher? (false = gold)", false),
    ],
    true,
);

export default function main(): void {
    const script = new SuppliesToSpinTheWheelofChance();
    Core.bankingBlackList.push(
        ...SuppliesToSpinTheWheelofChance.nation.suppliesRewards.concat(
            ...SuppliesToSpinTheWheelofChance.nation.swindlesReturnRewards,
        ),
    );
    Core.setOptions();

    script.doSupplies();

    Core.setOptions(false);
}
