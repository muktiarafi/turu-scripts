/*
name: Fiend's Purgatory
description: Ensures the acceptance requirements are owned, then completes 'Fiend's Purgatory' quest [10790] for the selected reward(s).
tags: hollowborn, hollowborn nation, fiends purgatory, void soul
*/
// Port of Scripts/Hollowborn/HollowbornNation/2FiendsPurgatory.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../CoreHollowborn";
import { InTheFiendsShadow, Rewards as InTheFiendsShadowRewards } from "./1InTheFiendsShadow";
import { CoreNation } from "../../nation/CoreNation";
import { JuggernautItemsofNulgath, RewardsSelection } from "../../nation/various/JuggernautItems";

const Nation = new CoreNation();
const Jug = new JuggernautItemsofNulgath();
const ITFS = new InTheFiendsShadow();
const HB = new CoreHollowborn();

export enum Rewards {
    All = "All",
    Hollowborn_Ungodly_Reavers_of_Nulgath = "Hollowborn_Ungodly_Reavers_of_Nulgath",
    Hollowborn_Phoenix_Blade_of_Nulgath = "Hollowborn_Phoenix_Blade_of_Nulgath",
    Hollowborn_Overfiend_Blade_of_Nulgath = "Hollowborn_Overfiend_Blade_of_Nulgath",
    Hollowborn_DragonBlade_of_Nulgath = "Hollowborn_DragonBlade_of_Nulgath",
    None = "None",
}

export class FiendsPurgatory {
    private static readonly questID = 10790;

    readonly requiredItems: string[] = [
        "DragonFire of Nulgath",
        "Crimson Plate of Nulgath",
        "Crimson Face Plate of Nulgath",
        "Ungodly Reavers of Nulgath",
        "Crystal Phoenix Blade of Nulgath",
        "Overfiend Blade of Nulgath",
        "Dark Makai of Nulgath",
    ];

    private readonly selectableRewards: string[] = [
        "Hollowborn Ungodly Reavers of Nulgath",
        "Hollowborn Phoenix Blade of Nulgath",
        "Hollowborn Overfiend Blade of Nulgath",
        "Hollowborn DragonBlade of Nulgath",
    ];

    private readonly randomRewards: string[] = [
        "Hollowborn Makai Pet",
        "Hollowborn Makai Battle Pet",
        "Hollowborn Hooded Makai Pet",
    ];

    purgatory(reward: Rewards = Rewards.All, QuestOnly = false): void {
        const HasReward = (): boolean => {
            if (QuestOnly) {
                return true;
            }
            // no chosenReward to check in this mode — don't block anything
            if (chosenReward.length === 0) {
                return true;
            }
            // safeguard: nothing to check against, don't loop forever
            return reward === Rewards.All
                ? chosenReward.every((x) => Core.checkInventory(x))
                : Core.checkInventory(chosenReward);
        };
        if (!Core.isCompletedBefore(10789)) {
            Core.logger("Doing Require previous quest");
            ITFS.fiendsShadow(InTheFiendsShadowRewards.None, true, false);
        }

        let chosenReward: string[] = [];
        if (!QuestOnly) {
            chosenReward =
                reward === Rewards.All
                    ? [
                          ...this.selectableRewards
                              .filter((x) => !["All", "None"].includes(x))
                              .map((x) => x.replaceAll("_", " ")),
                      ]
                    : [String(reward).replaceAll("_", " ")];
        }

        if (!QuestOnly && HasReward()) {
            return;
        }

        if (QuestOnly && Core.isCompletedBefore(FiendsPurgatory.questID)) {
            return;
        }

        this.ensureRequirements();

        Core.addDrop(
            ...[
                ...(QuestOnly
                    ? this.selectableRewards
                          .filter((x) => !["All", "None"].includes(x))
                          .map((x) => x.replaceAll("_", " "))
                    : chosenReward),
                ...this.randomRewards,
                "Void Soul",
            ],
        );

        if (QuestOnly) {
            const rewards = [
                ...(Core.initializeWithRetries(() => Core.questRewards(FiendsPurgatory.questID)) ?? []).filter(
                    (x) => x !== "Void Soul",
                ),
            ];
            if (rewards.length === 0) {
                Core.logger(
                    `No rewards found for quest ${FiendsPurgatory.questID} *or* Quest !Failed! to load, skipping.`,
                );
                return;
            }

            Core.ensureAccept(FiendsPurgatory.questID);

            // Fake complete `Self-Destructive Spell` to see boss
            bot.quests.updateQuest(10030);
            Core.huntMonster("deleuzetundra", "Blighted Zubami", "Blighted Zubami Badge", undefined, { isTemp: false });

            Core.huntMonster("voidsalek", "Salek Sprayer", "Spoil of Salek", undefined, { isTemp: false });
            Core.huntMonster("voidnerfkitten", "Sarah the Nerfkitten", "Sarah's Souvenir", undefined, {
                isTemp: false,
            });

            Core.ensureCompleteChoose(FiendsPurgatory.questID, [
                rewards.find((x) => !Core.checkInventory(x)) ?? rewards[0],
            ]);
            return;
        }

        bot.quests.updateQuest(10030); // to show Blighted Zubami
        while (!bot.shouldExit && !HasReward()) {
            Core.ensureAccept(FiendsPurgatory.questID);
            Core.huntMonster("deleuzetundra", "Blighted Zubami", "Blighted Zubami Badge", undefined, { isTemp: false });
            Core.huntMonster("voidsalek", "Salek Sprayer", "Spoil of Salek", undefined, { isTemp: false });
            Core.huntMonster("voidnerfkitten", "Sarah the Nerfkitten", "Sarah's Souvenir", undefined, {
                isTemp: false,
            });

            Core.ensureCompleteChoose(FiendsPurgatory.questID, chosenReward);
        }
    }

    ensureRequirements(): void {
        this.jugItem("Ungodly Reavers of Nulgath", RewardsSelection.Ungodly_Reavers_of_Nulgath);
        this.jugItem("Crystal Phoenix Blade of Nulgath", RewardsSelection.Crystal_Phoenix_Blade_of_Nulgath);
        this.jugItem("Overfiend Blade of Nulgath", RewardsSelection.Overfiend_Blade_of_Nulgath);
        this.jugItem("Dark Makai of Nulgath", RewardsSelection.Dark_Makaiof_Nulgath);

        this.twistedItem("DragonFire of Nulgath", 1316);
        this.twistedItem("Crimson Plate of Nulgath", 4695);
        this.twistedItem("Crimson Face Plate of Nulgath", 4961);
        HB.hardcoreContract();
    }

    private jugItem(itemName: string, selection: RewardsSelection): void {
        if (Core.checkInventory(itemName)) {
            return;
        }

        Core.logger(`Missing acceptance requirement "${itemName}", farming it.`);
        Jug.juggItems(selection);
    }

    private twistedItem(itemName: string, itemID: number): void {
        if (Core.checkInventory(itemName)) {
            return;
        }

        Core.logger(`Missing acceptance requirement "${itemName}", farming it.`);
        Core.equipClass(ClassType.Farm);
        while (!bot.shouldExit && !Core.checkInventory(itemName)) {
            Core.ensureAccept(765);
            Nation.farmTotemofNulgath(3);
            Core.huntMonster("underworld", "Skull Warrior", "Skull Warrior Rune");
            Core.ensureComplete(765, itemID);
        }
    }
}

export const scriptOptions = defineScriptOptions(
    "FiendsPurgatory",
    [
        Core.skipOptions,
        option.choice(
            "RewardSelect",
            "Choose Your Reward",
            "Which selectable reward to farm from 'Fiend's Purgatory'. Choose All to farm every selectable reward.",
            choices(Rewards),
            Rewards.All,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new FiendsPurgatory();
    Core.bankingBlackList.push(...script.requiredItems);
    Core.setOptions();

    script.purgatory(bot.config!.get<Rewards>("RewardSelect"));

    Core.setOptions(false);
}
