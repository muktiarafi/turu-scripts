/*
name: Hollowborn Archfiend - Run All
description: does all of Hollowborn Archfiend
tags: hollowborn, hollowborn archfiend, hollowbornarchfiend, hollowborn nation, do all, run all
*/
// Port of Scripts/Hollowborn/HollowbornNation/0RunAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { configEnum, Core } from "../../core/CoreBots";
import { InTheFiendsShadow, Rewards } from "./1InTheFiendsShadow";
import { FiendsPurgatory, Rewards as FiendsPurgatoryRewards } from "./2FiendsPurgatory";
import { MuddledPast } from "./3MuddledPast";
import { TugandPull } from "./4TugandPull";
import { Rewards as RolesUnreversedRewards, RolesUnreversed } from "./5RolesUnreversed";

const ITFS = new InTheFiendsShadow();
const FP = new FiendsPurgatory();
const MP = new MuddledPast();
const TaP = new TugandPull();
const RU = new RolesUnreversed();

export class HBA0 {
    getAll(): void {
        const getAllDrops = bot.config!.get<boolean>("getAll");
        const fiendsShadowReward = getAllDrops ? Rewards.All : bot.config.get<Rewards>("In The Fiend's Shadow");
        const fiendsPurgatoryReward = getAllDrops
            ? FiendsPurgatoryRewards.All
            : bot.config.get<FiendsPurgatoryRewards>("Fiend's Purgatory");
        const rolesUnreversedReward = getAllDrops
            ? RolesUnreversedRewards.All
            : configEnum("Roles Unreversed", RolesUnreversedRewards, RolesUnreversedRewards.All);

        if (fiendsShadowReward !== Rewards.None) {
            this.getFiendsShadowRewards(fiendsShadowReward);
        }
        if (!bot.shouldExit && fiendsPurgatoryReward !== FiendsPurgatoryRewards.None) {
            FP.purgatory(fiendsPurgatoryReward);
        }
        if (!bot.shouldExit) {
            MP.doMuddledPast();
        }
        if (!bot.shouldExit) {
            TaP.doTugandPull();
        }
        if (!bot.shouldExit && rolesUnreversedReward !== RolesUnreversedRewards.None) {
            this.getRolesUnreversedRewards(rolesUnreversedReward);
        }
    }

    private getFiendsShadowRewards(reward: Rewards): void {
        if (reward === Rewards.All) {
            for (const selectedReward of choices(Rewards) as Rewards[]) {
                if (bot.shouldExit) {
                    return;
                }
                if (selectedReward !== Rewards.All && selectedReward !== Rewards.None) {
                    ITFS.fiendsShadow(selectedReward);
                }
            }
            return;
        }

        ITFS.fiendsShadow(reward);
    }

    private getRolesUnreversedRewards(reward: RolesUnreversedRewards): void {
        if (reward === RolesUnreversedRewards.All) {
            for (const selectedReward of choices(RolesUnreversedRewards).map(
                (n) => RolesUnreversedRewards[n as keyof typeof RolesUnreversedRewards],
            )) {
                if (bot.shouldExit) {
                    return;
                }
                if (selectedReward !== RolesUnreversedRewards.All && selectedReward !== RolesUnreversedRewards.None) {
                    RU.doRolesUnreversed(selectedReward);
                }
            }
            return;
        }

        RU.doRolesUnreversed(reward);
    }
}

export const scriptOptions = defineScriptOptions(
    "HollowbornArchfiend",
    [
        option.bool(
            "getAll",
            "Get all items",
            "If true, each quest with selectable rewards will be completed until all rewards are collected. " +
                "If false, use the reward selection for each quest.",
            true,
        ),
        Core.skipOptions,
        option.choice(
            "In The Fiend's Shadow",
            "In The Fiend's Shadow Reward",
            "Reward selection for In The Fiend's Shadow",
            choices(Rewards),
            Rewards.All,
        ),
        option.choice(
            "Fiend's Purgatory",
            "Fiend's Purgatory Reward",
            "Reward selection for Fiend's Purgatory",
            choices(FiendsPurgatoryRewards),
            FiendsPurgatoryRewards.All,
        ),
        option.choice(
            "Roles Unreversed",
            "Roles Unreversed Reward",
            "Reward selection for Roles Unreversed",
            choices(RolesUnreversedRewards),
            RolesUnreversedRewards[RolesUnreversedRewards.All],
        ),
    ],
    true,
);

export default function main(): void {
    const script = new HBA0();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
