/*
name: In The Fiend's Shadow
description: Completes the 'In The Fiend's Shadow' quest [10789] for the selected reward(s), drops Void Soul.
tags: hollowborn, hollowborn nation, in the fiends shadow, void soul
*/
// Port of Scripts/Hollowborn/HollowbornNation/1InTheFiendsShadow.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, choices, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../CoreHollowborn";
import { HollowSoul } from "../materials/HollowSoul";
import { CoreNation } from "../../nation/CoreNation";

const Nation = new CoreNation();
const HSoul = new HollowSoul();
const HB = new CoreHollowborn();

export enum Rewards {
    All = "All",
    Hollowborn_Void_Sword = "Hollowborn_Void_Sword",
    Hollowborn_Soulreaper_of_Nulgath = "Hollowborn_Soulreaper_of_Nulgath",
    Hollowborn_Void_of_Nulgath = "Hollowborn_Void_of_Nulgath",
    Hollowborn_Void_Horns = "Hollowborn_Void_Horns",
    Hollowborn_Void_Helm = "Hollowborn_Void_Helm",
    None = "None",
}

export class InTheFiendsShadow {
    fiendsShadow(reward: Rewards = Rewards.All, QuestOnly = false, VoidSoulOnly = false, quant = 150): void {
        let chosenReward = new Array(0).fill("");
        if (!QuestOnly) {
            chosenReward = reward === Rewards.All ? this.selectableRewards : [String(reward).replaceAll("_", " ")];
        }

        if (!QuestOnly) {
            if (Core.checkInventory(chosenReward)) {
                return;
            } else if (QuestOnly && Core.isCompletedBefore(InTheFiendsShadow.questID)) {
                return;
            }
        }

        HB.hardcoreContract();

        if (!QuestOnly) {
            Core.addDrop(...chosenReward);
        }
        Core.addDrop("Void Soul");

        if (reward !== Rewards.None && !QuestOnly && !VoidSoulOnly) {
            Core.logger(`Reward Chosen: ${reward === Rewards.All ? "All" : String(reward).replaceAll("_", " ")}`);
        }

        if (QuestOnly) {
            Core.ensureAccept(InTheFiendsShadow.questID);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("lair", "Onyx Lava Dragon", "Phoenix Blade", undefined, { isTemp: false });

            // "Chaotic Tentacles" as there is 2 items with this name
            Core.farmingLogger("Chaotic Tentacles");
            while (!bot.shouldExit && !Core.checkInventory(16877)) {
                Core.killMonster("stormtemple", "r16", "Left", "*");
            }
            Nation.farmTotemofNulgath(1);
            HSoul.getYaSoulsHeeeere(50);

            Core.ensureComplete(InTheFiendsShadow.questID);
            return;
        }

        if (VoidSoulOnly) {
            while (!bot.shouldExit && !Core.checkInventory("Void Soul", quant)) {
                Core.ensureAccept(InTheFiendsShadow.questID);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("lair", "Onyx Lava Dragon", "Phoenix Blade", undefined, { isTemp: false });

                // "Chaotic Tentacles" as there is 2 items with this name
                Core.farmingLogger("Chaotic Tentacles");
                while (!bot.shouldExit && !Core.checkInventory(16877)) {
                    Core.killMonster("stormtemple", "r16", "Left", "*");
                }
                Nation.farmTotemofNulgath(1);
                HSoul.getYaSoulsHeeeere(50);

                Core.ensureComplete(InTheFiendsShadow.questID);
            }
            return;
        }

        while (!bot.shouldExit && !Core.checkInventory(chosenReward)) {
            Core.ensureAccept(InTheFiendsShadow.questID);
            Core.equipClass(ClassType.Solo);
            Core.huntMonster("lair", "Onyx Lava Dragon", "Phoenix Blade", undefined, { isTemp: false });

            // "Chaotic Tentacles" as there is 2 items with this name
            Core.farmingLogger("Chaotic Tentacles");
            while (!bot.shouldExit && !Core.checkInventory(16877)) {
                Core.killMonster("stormtemple", "r16", "Left", "*");
            }
            Nation.farmTotemofNulgath(1);
            HSoul.getYaSoulsHeeeere(50);

            Core.ensureCompleteChoose(InTheFiendsShadow.questID, chosenReward);
        }
    }

    private static readonly questID = 10789;
    private readonly selectableRewards: string[] = [
        "Hollowborn Void Sword",
        "Hollowborn Soulreaper of Nulgath",
        "Hollowborn Void of Nulgath",
        "Hollowborn Void Horns",
        "Hollowborn Void Helm",
    ];
}

export const scriptOptions = defineScriptOptions(
    "InTheFiendsShadow",
    [
        Core.skipOptions,
        option.choice(
            "RewardSelect",
            "Choose Your Reward",
            "Which reward to farm from 'In The Fiend's Shadow'. Choose All to farm every reward.",
            choices(Rewards),
            Rewards.All,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new InTheFiendsShadow();
    Core.setOptions();

    script.fiendsShadow(bot.config!.get<Rewards>("RewardSelect"));

    Core.setOptions(false);
}
