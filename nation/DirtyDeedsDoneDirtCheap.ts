/*
name: DirtyDeedsDoneDirtCheap
description: null
tags: null
*/
// Port of Scripts/Nation/DirtyDeedsDoneDirtCheap.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export enum Reward {
    All = 0,
    // special option
    BloodGemOfTheArchfiend = 1,
    DarkCrystalShard = 2,
    GemOfNulgath = 3,
    TaintedGem = 4,
    TotemofNulgath = 5,
}

export class DirtyDeedsDoneDirtCheap {
    getSRoEItemNames(reward: Reward): string[] {
        return reward === Reward.BloodGemOfTheArchfiend
            ? ["Blood Gem of the Archfiend"]
            : reward === Reward.DarkCrystalShard
              ? ["Dark Crystal Shard"]
              : reward === Reward.GemOfNulgath
                ? ["Gem of Nulgath"]
                : reward === Reward.TaintedGem
                  ? ["Tainted Gem"]
                  : reward === Reward.TotemofNulgath
                    ? ["Totem of Nulgath"]
                    : reward === Reward.All
                      ? ["All"]
                      : (() => {
                            throw new Error("reward");
                        })();
    }
}

export const scriptOptions = defineScriptOptions(
    "DDDDC_SwindlesRipoffEmporiumItem",
    [
        option.bool(
            "DoSRoE",
            "Do SRoE",
            'Once "Unidentified 10" are maxed, buy items from "Swindle\'s Ripoff Emporium"',
            false,
        ),
        option.choice(
            "RewardChoice",
            "SRoE Item",
            'Item to buy from "Swindle\'s Ripoff Emporium" (choose All to max all of {"Blood Gem of the Archfiend", "Dark Crystal Shard", "Gem of Nulgath", "Tainted Gem"})',
            choices(Reward),
            Reward[Reward.All],
        ),
        Core.skipOptions,
    ],
    true,
);

export default function main(): void {
    const script = new DirtyDeedsDoneDirtCheap();
    Core.setOptions();

    const chosenReward = configEnum("RewardChoice", Reward, Reward.All);
    const itemsToBuy = script.getSRoEItemNames(chosenReward);

    // now it can accept multiple
    Nation.dirtyDeedsDoneDirtCheap(undefined, bot.config.get<boolean>("DoSRoE"), itemsToBuy);

    Core.setOptions(false);
}
