/*
name: TendurrrTheAssistantQuests
description: null
tags: null
*/
// Port of Scripts/Nation/Various/TendurrrTheAssistantQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export enum RewardsSelection {
    Tendurrr_on_your_Back = 0,
    Asuka_Flaming_Stick = 1,
    Tendurrr_Flaming_Stick = 2,
    Tendurrr_Morph = 3,
    All,
}

export class TendurrrTheAssistantQuests {
    /**
     * Farms the selected Tendurrr The Assistant quest reward or all available rewards.
     *
     * @param reward The reward to obtain, or All to obtain every reward.
     */
    tendurrItems(reward: RewardsSelection = RewardsSelection.All): void {
        Core.addDrop(...Nation.bagDrops);
        Core.addDrop(...this.rewards);

        if (!Core.checkInventory("Tendurrr The Assistant")) {
            Core.killMonster("tercessuinotlim", "m2", "Left", "*", "Tendurrr The Assistant", undefined, {
                isTemp: false,
            });
        }

        Nation.farmUni13(1);

        if (reward !== RewardsSelection.All && reward >= this.rewards.length) {
            Core.logger(`Invalid Tendurrr reward selection: ${RewardsSelection[reward]}`);
            return;
        }

        const questRewards = Core.ensureLoad(5814).rewards;

        const selectedReward =
            reward === RewardsSelection.All
                ? null
                : (questRewards.find((x) => x.name === this.rewards[reward]) ?? null);

        if (reward !== RewardsSelection.All && selectedReward == null) {
            Core.logger(`Could not find the quest reward for ${RewardsSelection[reward]}.`);
            return;
        }

        let iteration = 1;

        while (
            !bot.shouldExit &&
            (reward === RewardsSelection.All
                ? !Core.checkInventory(this.rewards, undefined, { toInv: false })
                : !Core.checkInventory(selectedReward!.id, undefined, { toInv: false }))
        ) {
            if (reward === RewardsSelection.All) {
                Core.logger(`Farming Tendurrr rewards (attempt ${iteration++})`);
            } else {
                Core.logger(`Farming ${selectedReward!.name}`);
            }

            Core.ensureAccept(5814);

            Nation.approvalAndFavor(500, 500);
            Nation.essenceofNulgath(20);
            Nation.farmGemofNulgath(30);
            Nation.farmDarkCrystalShard(30);
            Nation.farmTaintedGem(30);
            Nation.farmDiamondofNulgath(30);
            Nation.farmVoucher({ member: true });
            Nation.farmBloodGem(10);
            Nation.farmTotemofNulgath(3);

            if (bot.shouldExit) {
                break;
            }

            if (reward === RewardsSelection.All) {
                if (!Core.ensureCompleteChoose(5814, this.rewards)) {
                    Core.logger("Failed to collect a Tendurrr reward. Stopping to prevent an endless farming loop.");
                    return;
                }
            } else {
                Core.ensureComplete(5814, selectedReward!.id);
            }
        }

        if (!bot.shouldExit && Core.checkInventory(this.rewards, undefined, { toInv: false })) {
            Core.logger("All Tendurrr rewards are owned.");
        }
    }

    readonly rewards: string[] = [
        "Tendurrr on your Back",
        "Asuka's Flaming Stick",
        "Tendurrr's Flaming Stick",
        "Tendurrr Morph",
    ];
}

export const scriptOptions = defineScriptOptions(
    "Reward Select",
    [
        Core.skipOptions,
        option.choice(
            "RewardsSelection",
            "Select Your Quest Reward",
            "Select Your Quest Reward for The Tendurr items of Nulgath quest.",
            choices(RewardsSelection),
            RewardsSelection[RewardsSelection.Tendurrr_on_your_Back],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new TendurrrTheAssistantQuests();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.bankingBlackList.push(...script.rewards);
    Core.setOptions();

    script.tendurrItems(configEnum("RewardsSelection", RewardsSelection, RewardsSelection.Tendurrr_on_your_Back));

    Core.setOptions(false);
}
