/*
name: BringTheCheer
description: null
tags: null
*/
// Port of Scripts/Other/Various/BringTheCheer.cs.

import { choices, defineScriptOptions, option } from "turu";
import { ClassType, configEnum, Core, type RewardItem } from "../../core/CoreBots";
import { CoreFrostvale } from "../../seasonal/frostvale/story/CoreFrostvale";

const Frostvale = new CoreFrostvale();

export enum RewardsSelection {
    All = 9999,
    CheerCaster_Armor = 46144,
    Cheery_Hat = 46145,
    Cheery_Locks = 46146,
    Cheery_Hat_Scarf = 46147,
    Cheery_Locks_Scarf = 46148,
    Stars_of_Joy = 46149,
    Stars_of_the_North = 46150,
    Wand_of_Joy = 46151,
    Dark_CheerCaster = 57791,
    Dark_CheerCaster_Hat = 57792,
    Dark_CheerCaster_Hat_Locks = 57793,
    Dark_CheerCaster_Accessories = 57794,
    Dark_CheerCaster_Accessories_Locks = 57795,
    Midnight_CheerCaster_Stars = 57796,
    Dark_CheerCaster_Wand = 57797,
}

export class BringTheCheer {
    questItems(reward: RewardsSelection = RewardsSelection.All): void {
        if (!Core.isSeasonalMapActive("frostvalfuture")) {
            Core.logger(
                `it is Currently ${new Date(Date.now()).toLocaleString("en-US", { month: "long" })}, The Maps Will Be out In December, as per the Design Notes.`,
            );
            return;
        }

        Frostvale.frostvalPastPresentandFuture();

        const RewardOptions = Core.ensureLoad(6651).rewards.map((x) => x.name);
        Core.addDrop(...RewardOptions);
        const getAll = (configEnum("RewardSelect", RewardsSelection, RewardsSelection.All) ?? null) === 9999;

        let item: RewardItem | null = null;
        if (!getAll) {
            item =
                Core.ensureLoad(6651).rewards.find(
                    (x) => x.id === (configEnum("RewardSelect", RewardsSelection, RewardsSelection.All) ?? null),
                ) ?? null;
            if (item == null) {
                Core.logger("Item not found in Quest Rewards");
                return;
            }
            if (Core.checkInventory(item.name)) {
                return;
            }
            Core.farmingLogger(item.name, 1);
        }

        Core.equipClass(ClassType.Solo);

        while (getAll ? !Core.checkInventory(RewardOptions) : !Core.checkInventory(item?.name ?? "")) {
            Core.ensureAccept(6651);
            Core.huntMonster("frostvalfuture", "Wargoth the Frozen", "Wrapped Parcel", undefined, { log: false });
            Core.huntMonster("frostvalpresent", "Time Wraith", "Time Ribbon", undefined, { log: false });
            Core.huntMonster("frostvalnext", "Xanta Claus", "Burning Bow", undefined, { log: false });
            Core.huntMonster("frostvalpast", "Ice Master Yeti", "Yeti Fur", undefined, { log: false });

            if (!getAll) {
                Core.ensureComplete(6651, item?.id);
            } else {
                Core.ensureCompleteChoose(6651);
            }
        }
    }

    readonly rewards: string[] = [
        "CheerCaster Armor",
        "Cheery Hat",
        "Cheery Locks",
        "Cheery Hat + Scarf",
        "Cheery Locks + Scarf",
        "Stars of Joy",
        "Stars of the North",
        "Wand of Joy",
        "Dark CheerCaster",
        "Dark CheerCaster Hat",
        "Dark CheerCaster Hat + Locks",
        "Dark CheerCaster Accessories",
        "Dark CheerCaster Accessories + Locks",
        "Midnight CheerCaster Stars",
        "Dark CheerCaster Wand",
    ];
}

export const scriptOptions = defineScriptOptions(
    "BringTheCheer",
    [
        Core.skipOptions,
        option.choice(
            "RewardSelect",
            "Choose Your Quest Reward",
            "Select Your Quest Reward for `Bring The Cheer`.",
            choices(RewardsSelection),
            RewardsSelection[RewardsSelection.All],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new BringTheCheer();
    Core.setOptions();

    Core.bankingBlackList.push(...script.rewards);
    script.questItems();

    Core.setOptions(false);
}
