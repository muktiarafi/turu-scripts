/*
name: EliteVoid
description: null
tags: null
*/
// Port of Scripts/Nation/Various/EliteVoid.cs.

import { bot, SkillUseMode } from "turu";
import { ClassType, Core } from "../../core/CoreBots";
import { CitadelRuins } from "../../story/nation/CitadelRuins";

const citadelRuins = new CitadelRuins();

export class EliteVoid {
    getAll(): void {
        const EliteVoidSet = [
            "Elite Void",
            "Elite Void Horns",
            "Elite Void Plume",
            "Elite Void Cape",
            "Elite Void Spiked Cape",
            "Elite Void Sword",
            "Elite Void Broadsword",
            "Elite Void Sword Pet",
        ];
        const ChooseRewardQuest = [
            "Elite Void",
            "Elite Void Horns",
            "Elite Void Plume",
            "Elite Void Cape",
            "Elite Void Spiked Cape",
        ];

        if (Core.checkInventory(EliteVoidSet, undefined, { toInv: false })) {
            return;
        }

        let count = 0;
        count = Core.checkSpaces(count, ...EliteVoidSet);

        Core.addDrop(...EliteVoidSet);

        citadelRuins.casparillasQuests();

        for (let i = 0; i < ChooseRewardQuest.length; i++) {
            if (!Core.checkInventory(ChooseRewardQuest[i])) {
                Core.logger(`Getting "${ChooseRewardQuest[i]}"`);
                //Spoiled Dragon 6679
                Core.ensureAccept(6679);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("lair", "Red Dragon", "Limited Time Drop");
                Core.ensureCompleteChoose(6679, [ChooseRewardQuest[i]]);
            }
        }

        if (!Core.checkInventory("Elite Void Sword")) {
            Core.logger(`Getting "Elite Void Sword"`);
            // C# loops while Bot.ShouldExit (never, while running), so these three items were never farmed.
            while (!bot.shouldExit && !Core.checkInventory("Elite Void Sword")) {
                //The Unpredictable Element 6680
                Core.ensureAccept(6680);
                Core.equipClass(ClassType.Solo);
                Core.huntMonster("ledgermayne", "ledgermayne", "Concentrated Mana Extracted", 2);
                Core.ensureComplete(6680);
            }
        }

        if (!Core.checkInventory("Elite Void Broadsword")) {
            Core.logger(`Getting "Elite Void Broadsword"`);
            while (!bot.shouldExit && !Core.checkInventory("Elite Void Broadsword")) {
                //There, But Not There 6681
                Core.ensureAccept(6681);
                Core.equipClass(ClassType.Farm);
                Core.huntMonster("palace", "Invisible", "…Something? Slain", 5);
                Core.ensureComplete(6681);
            }
        }

        if (!Core.checkInventory("Elite Void Sword Pet")) {
            Core.logger(`Getting "Elite Void Sword Pet"`);
            while (!bot.shouldExit && !Core.checkInventory("Elite Void Sword Pet")) {
                //Staying Humble 6682
                Core.ensureAccept(6682);
                //why the fuck was the class buffed!?
                const usethis =
                    bot.inventory.items
                        .concat(...bot.bank.items)
                        .find((n) => n.name === "Yami no Ronin" || n.name.startsWith("Chaos Slayer")) ?? null;
                if (usethis != null) {
                    Core.equip(usethis.id);
                    Core.equip(...Core.farmGear);
                    if (usethis.name === "Yami no Ronin") {
                        bot.skills.startSkills("1 | 4", -1, SkillUseMode.UseIfAvailable);
                    }
                } else {
                    Core.equipClass(ClassType.Dodge);
                }

                Core.huntMonster("underlair", "ArchFiend DragonLord", "Twisted Armor Piece", 3);
                Core.ensureComplete(6682);
            }
        }
        Core.toBank(...EliteVoidSet);
    }
}

export default function main(): void {
    const script = new EliteVoid();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
