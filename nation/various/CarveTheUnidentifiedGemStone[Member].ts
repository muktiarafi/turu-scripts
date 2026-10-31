/*
name: CarveTheUnidentifiedGemStone[Member]
description: null
tags: null
*/
// Port of Scripts/Nation/Various/CarveTheUnidentifiedGemStone[Member].cs.

import { choices, defineScriptOptions, option } from "turu";
import { configOr, Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export enum ChooseReward {
    Dark_Crystal_Shard = "Dark_Crystal_Shard",
    Diamond_of_Nulgath = "Diamond_of_Nulgath",
    Gem_of_Nulgath = "Gem_of_Nulgath",
    Blood_Gem_of_the_Archfiend = "Blood_Gem_of_the_Archfiend",
    All = "All",
}

export class CarveTheUnidentifiedGemStone {
    doCarveTheUnidentifiedGemStone(): void {
        const reward = configOr("ChooseReward", ChooseReward.Dark_Crystal_Shard);
        if (reward === ChooseReward.All) {
            Nation.carveUniGemStone();
        } else {
            // C# passes the enum name ("Dark_Crystal_Shard"), which no item matches, so the farm never stopped.
            Nation.carveUniGemStone(reward.replaceAll("_", " "));
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "CarveTheUnidentifiedGemStone",
    [
        Core.skipOptions,
        option.choice("ChooseReward", "Choose Your Reward", "Pick A Reward", choices(ChooseReward), ChooseReward.All),
    ],
    true,
);

export default function main(): void {
    const script = new CarveTheUnidentifiedGemStone();
    Core.setOptions();

    script.doCarveTheUnidentifiedGemStone();

    Core.setOptions(false);
}
