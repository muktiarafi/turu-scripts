/*
name: Free Daily Boost Daily
description: Free Daily Boost
tags: daily, free daily boost, member, boost, free, 60 minutes, 60 min, sixty minutes
*/
// Port of Scripts/Dailies/FreeDailyBoost[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreDailies, DailyBoostRewards } from "../core/CoreDailies";

const Daily = new CoreDailies();

export class FreeDailyBoost {}

export const scriptOptions = defineScriptOptions(
    "FreeDailyBoost(mem)",
    [
        option.choice(
            "BoostReward",
            "Choose Your Daily Boost Reward",
            "Select the reward to apply (XP, Gold, Rep, Class Boost)",
            choices(DailyBoostRewards),
            DailyBoostRewards[DailyBoostRewards.LowestQuantOwned],
        ), // Single option for reward
        Core.skipOptions, // Skip options when set
    ],
    true,
);

export default function main(): void {
    Core.setOptions();

    // Get the selected reward from the script options and log it
    const selectedReward = configEnum("BoostReward", DailyBoostRewards, DailyBoostRewards.EXP);

    // Call FreeDailyBoost, passing in the selected reward
    Daily.freeDailyBoost(selectedReward);

    Core.setOptions(false);
}
