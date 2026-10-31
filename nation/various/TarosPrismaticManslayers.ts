/*
name: TarosPrismaticManslayers
description: null
tags: null
*/
// Port of Scripts/Nation/Various/TarosPrismaticManslayers.cs.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";
import { TarosManslayer } from "./TarosManslayer";

const Farm = new CoreFarms();
const Nation = new CoreNation();
const Taro = new TarosManslayer();

export class TarosPrismaticManslayers {
    // Unused, as in C#.
    rewards: string[] = ["Taro's Prismatic Manslayer", "Taro's Dual Prismatic Manslayers", "Taro's BattleBlade"];

    temptationTest(): void {
        const Q = Core.initializeWithRetries(() => bot.quests.ensureLoad(8496));
        if (Q == null) {
            Core.logger("Failed to load the quest `A Test of Temptation`");
            return;
        }

        if (Core.checkInventory(Q.rewards.map((x) => x.id)) || !Core.isMember) {
            Core.logger(
                !Core.isMember
                    ? "Membership required for the quest `A Test of Temptation`"
                    : "Rewards already in inventory",
            );
            return;
        }

        Core.addDrop(...Q.rewards.map((x) => x.id));

        Farm.experience(80);
        Farm.goodREP();

        // Aquire the accept requirement
        if (!Core.checkInventory("Taro's Manslayer")) {
            Taro.guardianTaro();
        }

        // Reverse the array so the battlepet is last
        for (const reward of [...Q.rewards].reverse()) {
            if (Core.checkInventory(reward.name, undefined, { toInv: false })) {
                Core.logger(`${reward.name} obtained.`);
                continue;
            } else {
                Core.addDrop(reward.id);
                Core.farmingLogger(reward.name, 1);
            }

            Core.ensureAccept(8496);
            Nation.farmTaintedGem(200);
            Nation.farmDarkCrystalShard(125);
            Nation.farmDiamondofNulgath(300);
            Nation.farmGemofNulgath(75);
            Nation.farmBloodGem(35);
            Core.ensureComplete(8496, reward.id);
        }
    }
}

export default function main(): void {
    const script = new TarosPrismaticManslayers();
    Core.setOptions();

    script.temptationTest();

    Core.setOptions(false);
}
