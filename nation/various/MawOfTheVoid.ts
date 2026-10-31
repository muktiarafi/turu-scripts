/*
name: Maw of the Void
description: This script will farm Maw of the Void quest items.
tags: fiend's creed blade,fiend's creed blades,maw,nulgath gifts
*/
// Port of Scripts/Nation/Various/MawOfTheVoid.cs.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";
import { JuggernautItemsofNulgath, RewardsSelection } from "./JuggernautItems";
import { TempleSiegeMerge } from "../../seasonal/staffbirthdays/nulgath/TempleSiegeMerge";

const Farm = new CoreFarms();
const Nation = new CoreNation();
const Jug = new JuggernautItemsofNulgath();
const TSM = new TempleSiegeMerge();

export class MawOfTheVoid {
    getAll(): void {
        if (Core.checkInventory(Core.questRewards(10020))) {
            return;
        }

        if (!bot.quests.hasBeenCompleted(9541)) {
            Core.chainComplete(9541);
        }

        Farm.evilREP(9);

        Core.addDrop(...Core.ensureLoad(10020).requirements.map((req) => req.name));

        const RewardOptions = Core.ensureLoad(10020).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            // C# returns here, so owning the first reward ended the script before the others.
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(Reward.name, 1);

            Core.ensureAccept(10020);

            // Tainted Gem
            Nation.farmTaintedGem(175);

            // Essence of Nulgath
            Nation.essenceofNulgath(40);

            // Dark Makai of Nulgath
            Jug.juggItems(RewardsSelection.Dark_Makaiof_Nulgath);

            // Adventus Wolf
            Core.huntMonster("legioncrypt", "Brutus", "Adventus Wolf", undefined, { isTemp: false });

            // Hot Mama
            Core.huntMonster("battleundere", "Hot Mama", "Hot Mama", undefined, { isTemp: false });

            // Borgar
            if (!Core.checkInventory("Borgar")) {
                let LoggedBefore = false;
                while (!bot.shouldExit && !Core.checkInventory("Burger Buns", 5)) {
                    // Burglinster's Revenge 7522
                    Core.ensureAccept(7522);
                    Core.huntMonster("borgars", "Burglinster", "Burglinster Cured", undefined, { log: !LoggedBefore });
                    Core.ensureComplete(7522);
                    bot.wait.forPickup("Burger Buns");
                    LoggedBefore = true;
                }
            }
            Core.buyItem("borgars", 1884, 54650, undefined, 7387);

            // Abyssal Makai
            TSM.buyAllMerge("Abyssal Makai");

            Core.ensureComplete(10020, Reward.id);
            Core.jumpWait();
            Core.toBank(Reward.name);
        }
    }
}

export default function main(): void {
    const script = new MawOfTheVoid();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
