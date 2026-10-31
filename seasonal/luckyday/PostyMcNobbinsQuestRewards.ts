/*
name: Posty Mc Nobbins Quest Rewards
description: gest the quest rewards from all 4 quest from mc nobbins.
tags: mc nobbins, quest reward, farm, lucky day, luck, seasonal
*/
// Port of Scripts/Seasonal/LuckyDay/PostyMcNobbinsQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class PostyMcNobbinsQuestRewards {
    potDrops: string[] = [
        "Leprechaun Ranger",
        "Leprechaun Ranger's TopHat",
        "Leprechaun Ranger's TopHat + Locks",
        "Lucky Day TopHat",
        "Lucky Day TopHat + Glasses",
        "Lucky Day TopHat + Locks",
        "Lucky Emerald TopHat",
        "Lucky Emerald TopHat + Glasses",
        "Lucky Emerald TopHat + Locks",
        "Platinum Coin",
        "Rainbow Coin",
    ];

    allRewards(): void {
        if (!Core.isSeasonalMapActive("luck")) {
            return;
        }

        const AllRewards = [
            ...[
                ...[
                    ...[
                        ...Core.ensureLoad(5758).rewards.map((i) => i.name),
                        ...Core.ensureLoad(5759).rewards.map((i) => i.name),
                    ],
                    ...Core.ensureLoad(5760).rewards.map((i) => i.name),
                ],
                ...Core.ensureLoad(5761).rewards.map((i) => i.name),
            ],
            ...this.potDrops,
        ];

        Core.equipClass(ClassType.Solo);
        Adv.smartEnhance(Core.soloClass);

        bot.drops.add(...AllRewards);

        Core.registerQuests(5758, 5759, 5760, 5761);
        while (!bot.shouldExit && !Core.checkInventory(AllRewards, undefined, { toInv: false })) {
            Core.huntMonster("luck", "Pot O' Gold", undefined, undefined, { log: false });
        }
        Core.cancelRegisteredQuests();
        Core.toBank(...AllRewards);
    }

    test1(): void {
        Core.oneTimeMessage(
            "ReadMe",
            'plese ignore the "item cannot be added inventory" message ingame just means you already have the item in the bank, should only be doing this for the drops from the pot.',
            true,
            true,
        );

        const rewards1 = Core.questRewards(5758);
        const rewards2 = Core.questRewards(5759);
        const rewards3 = Core.questRewards(5760);
        const rewards4 = Core.questRewards(5761);

        const AllDrops = rewards1
            .concat(...rewards2)
            .concat(...rewards3)
            .concat(...rewards4)
            .concat(...this.potDrops);

        for (const item of AllDrops) {
            if (!Core.checkInventory(item, undefined, { toInv: false })) {
                bot.drops.add(item);
            }
        }
        Core.addDrop("Platinum Coin", "Rainbow Coin");
        Core.registerQuests(5758, 5759, 5760, 5761);
        for (const item of AllDrops) {
            while (!bot.shouldExit && !Core.checkInventory(AllDrops, undefined, { toInv: false })) {
                if (Core.checkInventory(item, undefined, { toInv: false })) {
                    Core.logger(`${item} already exists in Inventory/Bank`);
                    bot.drops.remove(item);
                    return;
                }

                Core.farmingLogger(item, 1);
                Core.huntMonster("luck", "Pot O' Gold", item, undefined, { isTemp: false, log: false });
                bot.drops.remove(item);
                Core.toBank(item);
            }
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new PostyMcNobbinsQuestRewards();
    Core.bankingBlackList.push("Platinum Coin", "Rainbow Coin");
    Core.setOptions();

    script.test1();

    Core.setOptions(false);
}
