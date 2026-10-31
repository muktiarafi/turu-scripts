/*
name: HollowbornOrbQuests
description: Completes the Quests from the Hollowborn Orb - with a choosable option
tags: hollowborn, hollowborn nation, hollowborn orb, hexed void, blood for blood, frontline fiend, empty void
*/
// Port of Scripts/Hollowborn/HollowbornNation/HollowbornOrbQuests.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { Core } from "../../core/CoreBots";
import { InTheFiendsShadow, Rewards as InTheFiendsShadowRewards } from "./1InTheFiendsShadow";
import { Rewards as RolesUnreversedRewards, RolesUnreversed } from "./5RolesUnreversed";
import { CoreNation } from "../../nation/CoreNation";

const Nation = new CoreNation();
const RU = new RolesUnreversed();
const ITFS = new InTheFiendsShadow();

export enum Rewards {
    All = "All",
    Hexed_Void = "Hexed_Void",
    Blood_for_Blood = "Blood_for_Blood",
    Frontline_Fiend = "Frontline_Fiend",
    Empty_Void = "Empty_Void",
    None = "None",
}

export class HollowbornOrbQuests {
    doThing(reward: Rewards = Rewards.All): void {
        const chosen = reward === Rewards.All ? [...[...HollowbornOrbQuests.questIDs.keys()]] : [reward];

        for (const selectedReward of chosen) {
            const questId = HollowbornOrbQuests.questIDs.get(selectedReward)!;

            const rewards = Core.initializeWithRetries(() => Core.questRewards(questId));

            if (rewards != null) {
                Core.addDrop(...rewards);
            }

            this.doQuest(questId, selectedReward, rewards ?? []);
        }
    }

    private doQuest(questId: number, reward: Rewards, rewards: string[]): void {
        if (!Core.checkInventory("Hollowborn Void Orb")) {
            RU.doRolesUnreversed(RolesUnreversedRewards.Hollowborn_Void_Orb);
        }

        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.ensureAccept(questId);

            // Blood Gem of the Archfiend X10
            Nation.farmBloodGem(10);

            // Unidentified 13 X1
            Nation.farmUni13(1);

            // Unidentified for this quest x1
            Nation.theAssistant(HollowbornOrbQuests.uniforQuest(questId));

            // Hollowborn Void of Nulgath
            ITFS.fiendsShadow(InTheFiendsShadowRewards.Hollowborn_Void_of_Nulgath, undefined, undefined, 1);

            // There is no Myself x1 (Empty Void only)
            if (reward === Rewards.Empty_Void) {
                // Fake Complete 'Defeat the 12 Lords of Chaos!' to access map.
                bot.quests.updateQuest(3879);

                while (!bot.shouldExit && !Core.checkInventory(33306)) {
                    Core.killMonster("chaoslord", "r2", "Left", "*");
                }
            }

            Core.ensureComplete(questId);
        }
    }

    static uniforQuest(questId: number): string | null {
        return questId === 10794
            ? Nation.uni(22)
            : questId === 10795
              ? Nation.uni(23)
              : questId === 10796
                ? Nation.uni(24)
                : questId === 10798
                  ? Nation.uni(25)
                  : null;
    }

    private static readonly questIDs: Map<Rewards, number> = new Map([
        [Rewards.Hexed_Void, 10794],
        [Rewards.Blood_for_Blood, 10795],
        [Rewards.Frontline_Fiend, 10796],
        [Rewards.Empty_Void, 10798],
    ]);
}

export const scriptOptions = defineScriptOptions(
    "HollowbornOrbQuests",
    [
        Core.skipOptions,
        option.choice(
            "RewardSelect",
            "Choose Your Quest",
            "Which quest to complete from the Hollowborn Orb. Choose All to complete every quest.",
            choices(Rewards),
            Rewards.All,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new HollowbornOrbQuests();
    Core.setOptions();

    script.doThing(bot.config!.get<Rewards>("RewardSelect"));

    Core.setOptions(false);
}
