/*
name: Birthday Feast Rewards
description: This will obtain all of the quest rewards of your quest choice.
tags: birthday-feast-quest-rewards, seasonal, harvest-day
*/
// Port of Scripts/Seasonal/HarvestDay/BirthdayFeastQuestRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot, defineScriptOptions, option } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class BirthdayFeastQuestRewards {
    configure(): void {
        if (bot.config!.get<boolean>("ArlettesQuests")) {
            this.arlettesQuests();
            const arlettesQuest = Core.initializeWithRetries(() => Core.ensureLoad(8385));
            if (arlettesQuest != null) {
                Core.toBank(...arlettesQuest.rewards.map((r) => r.name));
            }
        }

        if (bot.config!.get<boolean>("InanitasQuests")) {
            this.inanitasQuests();
            const inanitasQuest = Core.initializeWithRetries(() => Core.ensureLoad(8384));
            if (inanitasQuest != null) {
                Core.toBank(...inanitasQuest.rewards.map((r) => r.name));
            }
        }

        if (bot.config!.get<boolean>("MemetsQuests")) {
            this.memetsQuests();
            const memetsQuest = Core.initializeWithRetries(() => Core.ensureLoad(8382));
            if (memetsQuest != null) {
                Core.toBank(...memetsQuest.rewards.map((r) => r.name));
            }
        }

        if (bot.config!.get<boolean>("KotarosQuests")) {
            this.kotarosQuests();
            const kotarosQuest = Core.initializeWithRetries(() => Core.ensureLoad(8383));
            if (kotarosQuest != null) {
                Core.toBank(...kotarosQuest.rewards.map((r) => r.name));
            }
        }
    }

    i = 0;

    arlettesQuests(): void {
        const RewardOptions = Core.ensureLoad(8385).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        const QuestRewards = RewardOptions.map((x) => x.name);

        Core.equipClass(ClassType.Farm);
        Core.registerQuests(8385);
        //Arlette's Birthday Quest 8385
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("celestialrealm", "Celestial Bird of Paradise", "Celestial Artifact", 6, {
                        log: false,
                    });
                    Core.huntMonster("celestialrealm", "Infernal Imp", "Infernal Artifact", 6, { log: false });

                    this.i++;

                    if (this.i % 5 === 0) {
                        Core.jumpWait();
                        Core.toBank(...QuestRewards);
                    }
                }
            }
        }

        // foreach (ItemBase Reward in RewardOptions) { Core.ToBank(Reward.Name); }
    }

    inanitasQuests(): void {
        const RewardOptions = Core.ensureLoad(8384).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        const QuestRewards = RewardOptions.map((x) => x.name);

        Core.equipClass(ClassType.Solo);

        Core.registerQuests(8384);
        // Inanitas' Birthday Quest 8384
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("timeinn", "Ezrajal", "Ezrajal's Feather", undefined, { log: false });

                    this.i++;

                    if (this.i % 5 === 0) {
                        Core.jumpWait();
                        Core.toBank(...QuestRewards);
                    }
                }
            }
        }
        // foreach (ItemBase Reward in RewardOptions) { Core.ToBank(Reward.Name); }
    }

    kotarosQuests(): void {
        const RewardOptions = Core.ensureLoad(8383).rewards;

        for (const item of RewardOptions) {
            bot.drops.add(item.name);
        }

        const QuestRewards = RewardOptions.map((x) => x.name);

        Core.equipClass(ClassType.Solo);

        Core.registerQuests(8383);
        //Kotaro's Birthday Quest 8383
        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);

                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("shinkansen", "Saint Eta", "Saint Eta's Gauntlet", undefined, { log: false });

                    this.i++;

                    if (this.i % 5 === 0) {
                        Core.jumpWait();
                        Core.toBank(...QuestRewards);
                    }
                }
            }
        }
        // foreach (ItemBase Reward in RewardOptions) { Core.ToBank(Reward.Name); }
    }

    memetsQuests(): void {
        const RewardOptions = Core.ensureLoad(8382).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        const QuestRewards = RewardOptions.map((x) => x.name);

        Core.registerQuests(8382);
        // Memet's Birthday Quest 8382
        Core.equipClass(ClassType.Solo);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                Core.logger(`${Reward.name} Found.`);
            } else {
                Core.farmingLogger(Reward.name, 1);
                while (!bot.shouldExit && !Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                    Core.huntMonster("byrodax", "Mutated Critter", "Picture of Mutated Critter", 3, { log: false });
                    Core.huntMonster("byrodax", "Byro-Dax Monstrosity", "Picture of Byro-Dax Monstrosity", undefined, {
                        log: false,
                    });
                    this.i++;

                    if (this.i % 5 === 0) {
                        Core.jumpWait();
                        Core.toBank(...QuestRewards);
                    }
                }
            }
        }
        // foreach (ItemBase Reward in RewardOptions) { Core.ToBank(Reward.Name); }
    }
}

export const scriptOptions = defineScriptOptions(
    "BirthdayFeast",
    [
        Core.skipOptions,
        option.bool(
            "ArlettesQuests",
            "ArlettesQuests Rewards",
            'Farms All "Arlette\'s Birthday Quest (8385)" Rewards.',
            false,
        ),
        option.bool(
            "InanitasQuests",
            "InanitasQuests Rewards",
            'Farms All "Inanitas\' Birthday Quest (8384)" Rewards.',
            false,
        ),
        option.bool(
            "MemetsQuests",
            "MemetsQuests Rewards",
            'Farms All "Memet\'s Birthday Quest (8382)" Rewards.',
            false,
        ),
        option.bool(
            "KotarosQuests",
            "KotarosQuests Rewards",
            'Farms All "Kotaro\'s Birthday Quest (8383)" Rewards.',
            false,
        ),
    ],
    true,
);

export default function main(): void {
    const script = new BirthdayFeastQuestRewards();
    Core.setOptions();

    script.configure();

    Core.setOptions(false);
}
