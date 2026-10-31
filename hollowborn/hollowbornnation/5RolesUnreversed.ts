/*
name: Roles Unreversed
description: Completes the 'Roles Unreversed' quest [10793], drops Void Soul.
tags: hollowborn, hollowborn nation, Roles Unreversed, void soul
*/
// Port of Scripts/Hollowborn/HollowbornNation/5RolesUnreversed.cs.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../CoreHollowborn";
import { TugandPull } from "./4TugandPull";

const TaP = new TugandPull();
const HB = new CoreHollowborn();

export enum Rewards {
    All = 0,
    Hollowborn_Hood_of_Nulgath = 101890,
    Hollowborn_Legacy_of_Nulgath_Horns = 101892,
    Hollowborn_Skull_of_Nulgath = 101894,
    Dual_Hollowborn_Spear_of_Nulgath = 101897,
    Dual_Hollowborn_Phoenix_Blade_of_Nulgath = 101901,
    Dual_Hollowborn_Overfiend_Blade_of_Nulgath = 101903,
    Dual_Hollowborn_DragonBlade_of_Nulgath = 101905,
    Dual_Hollowborn_Void_Sword = 101907,
    Dual_Hollowborn_Soulreaper_of_Nulgath = 101909,
    Hollowborn_Hands_of_Nulgath = 101917,
    Hollowborn_Mini_Nulgath_Battle_Pet = 101922,
    Hollowborn_Nulgath_Larvae = 101923,
    Hollowborn_Void_Orb = 101927,
    Hollowborn_Shadow_Morph_of_the_Oversoul = 101928,
    None = -1,
}

export class RolesUnreversed {
    doRolesUnreversed(reward: Rewards = Rewards.All, QuestOnly = false): void {
        if (reward === Rewards.None) {
            return;
        }

        if (!Core.isCompletedBefore(RolesUnreversed.questID)) {
            Core.logger("Completing previous quest *once*");
            TaP.doTugandPull(true);
        }

        let chosenRewardNames: string[] = [];
        let chosenRewardIds: number[] = [];

        if (!QuestOnly) {
            if (reward === Rewards.All) {
                const allRewards = [
                    ...choices(Rewards)
                        .map((n) => Rewards[n as keyof typeof Rewards])
                        .filter((r) => r !== Rewards.All && r !== Rewards.None),
                ];

                chosenRewardNames = [...allRewards.map(RolesUnreversed.getRewardName)];
                chosenRewardIds = [...allRewards.map((r) => r)];
            } else {
                chosenRewardNames = [RolesUnreversed.getRewardName(reward)];
                chosenRewardIds = [reward];
            }
        }

        if (!QuestOnly && Core.checkInventory(chosenRewardNames)) {
            return;
        }

        if (QuestOnly && Core.isCompletedBefore(RolesUnreversed.questID)) {
            return;
        }

        HB.hardcoreContract();
        Core.addDrop(...Core.questRewards(RolesUnreversed.questID));

        if (QuestOnly) {
            /*
            Unidentified 36 x5  
            Fresh Soul x50
            */
            HB.freshSouls(5, 50);
            return;
        }

        while (!bot.shouldExit && !Core.checkInventory(chosenRewardNames)) {
            Core.ensureAccept(RolesUnreversed.questID);

            /*
            Unidentified 36 x5  
            Fresh Soul x50
            */
            HB.freshSouls(5, 50);

            if (reward === Rewards.All) {
                Core.ensureCompleteChoose(RolesUnreversed.questID, chosenRewardNames);
            } else {
                Core.ensureComplete(RolesUnreversed.questID, chosenRewardIds[0]);
            }
        }
    }

    private static readonly questID = 10793;

    // Unused, as in C#.
    readonly selectableRewards: string[] = [
        "Hollowborn Hood of Nulgath",
        "Hollowborn Legacy of Nulgath Horns",
        "Hollowborn Skull of Nulgath",
        "Dual Hollowborn Spear of Nulgath",
        "Dual Hollowborn Phoenix Blade of Nulgath",
        "Dual Hollowborn Overfiend Blade of Nulgath",
        "Dual Hollowborn DragonBlade of Nulgath",
        "Dual Hollowborn Void Sword",
        "Dual Hollowborn Soulreaper of Nulgath",
        "Hollowborn Hands of Nulgath",
        "Hollowborn Mini-Nulgath Battle Pet",
        "Hollowborn Nulgath Larvae",
        "Hollowborn Void Orb",
        "Hollowborn Shadow Morph of the Oversoul",
    ];

    private static getRewardName(reward: Rewards): string {
        return reward === Rewards.Hollowborn_Mini_Nulgath_Battle_Pet
            ? "Hollowborn Mini-Nulgath Battle Pet"
            : Rewards[reward].replaceAll("_", " ");
    }
}

export const scriptOptions = defineScriptOptions(
    "RolesUnreversed",
    [
        Core.skipOptions,
        option.choice(
            "RewardSelect",
            "Choose Your Reward",
            "Which selectable reward to farm from 'Roles Unreversed'. Choose All to farm every selectable reward.",
            choices(Rewards),
            Rewards[Rewards.All],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new RolesUnreversed();
    Core.setOptions();

    script.doRolesUnreversed();

    Core.setOptions(false);
}
