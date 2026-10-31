/*
name: SwindlesReturnPolicy
description: null
tags: null
*/
// Port of Scripts/Nation/SwindlesReturnPolicy.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export enum RewardsSelection {
    Dark_Crystal_Shard = 4770,
    Diamond_of_Nulgath = 4771,
    Gem_of_Nulgath = 6136,
    Blood_Gem_of_the_Archfiend = 22332,
    Tainted_Gem = 4769,
    All = 0,
}

export class SwindlesReturnPolicy {
    doSwindlesReturnPolicy(reward: RewardsSelection | null = null, getAll = false): void {
        Core.logger(`Reward set to ${reward != null ? RewardsSelection[reward!].replaceAll("_", " ") : null}`);

        if (reward === RewardsSelection.All || reward == null) {
            getAll = true;
        }

        if (!getAll) {
            const quest = Core.initializeWithRetries(() => Core.ensureLoad(7551));
            if (quest == null) {
                Core.logger("Quest 7551 not found.");
                return;
            }
            const item = quest.rewards.find((x) => x.name === RewardsSelection[reward!!].replaceAll("_", " ")) ?? null;
            if (item == null) {
                Core.logger(
                    `Reward with name ${RewardsSelection[reward!!].replaceAll("_", " ")} not found in Quest Rewards.`,
                );
                return;
            }
            Core.logger(`Item Selected: ${item.name}[${item.id}]`);
            Nation.swindleReturn(item.name, item.maxStack);
        } else {
            const quest = Core.initializeWithRetries(() => Core.ensureLoad(7551));
            if (quest == null) {
                Core.logger("Quest 7551 not found.");
                return;
            }

            Core.logger(
                "Maxing All Rewards from Swindles return:\n" +
                    quest.rewards
                        .map((r) => {
                            const current = bot.tempInv.getQuantity(r.name) + bot.inventory.getQuantity(r.name);
                            const target = r.maxStack;
                            return `Farming ${r.name} (${current}/${target})`;
                        })
                        .join("\n"),
            );

            for (const thing of Core.ensureLoad(7551).rewards) {
                if (Core.checkInventory(thing.name, thing.maxStack)) {
                    continue;
                }

                Nation.swindleReturn(thing.name, thing.maxStack);
            }
        }

        Core.cancelRegisteredQuests();
    }
}

export const scriptOptions = defineScriptOptions(
    "SwindlesReturnPolicy",
    [
        Core.skipOptions,
        option.choice(
            "RewardSelect",
            "Choose Your Quest Reward",
            "Select Your Quest Reward for Swindle's Return Policy.",
            choices(RewardsSelection),
            RewardsSelection[RewardsSelection.All],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new SwindlesReturnPolicy();
    Core.bankingBlackList.push(...Nation.receipt);
    Core.setOptions();

    script.doSwindlesReturnPolicy(configEnum("RewardSelect", RewardsSelection, RewardsSelection.Dark_Crystal_Shard));

    Core.setOptions(false);
}
