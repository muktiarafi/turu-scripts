/*
name: The Green WeaponSnack
description: farms quest rewards from `The Green WeaponSnack` in /gardenquest
tags: green, weaponsnack, cucumber, salt, sugar, spices, pickle, pickle pullover, pickle face
*/
// Port of Scripts/Seasonal/AprilFools/TheGreenWeaponSnack.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class TheGreenWeaponSnack {
    questID = 9692;

    getRewards(): void {
        if (
            !Core.isSeasonalMapActive("gardenquest") ||
            Core.checkInventory(Core.questRewards(this.questID), undefined, { toInv: false })
        ) {
            return;
        }

        const RewardOptions = Core.ensureLoad(this.questID).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Solo);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                continue;
            }

            Core.logger(
                Core.checkInventory(Reward.id, undefined, { toInv: false })
                    ? `${Reward.name}: ✅`
                    : `${Reward.name} ❌`,
            );

            Core.farmingLogger(Reward.name, 1);
            Core.registerQuests(this.questID);
            while (!bot.shouldExit && !Core.checkInventory(Reward.id)) {
                Core.killMonster("gardenquest", "r2", "Right", "Overconfident Radish", "Spices", 10, {
                    isTemp: false,
                    log: false,
                });
                Core.killMonster("gardenquest", "r3", "Right", "Silly Karrot", "Salt + Sugar", 10, {
                    isTemp: false,
                    log: false,
                });
                Core.killMonster("gardenquest", "r7", "Right", "Vegetable Prince", "Cucumber", 10, {
                    isTemp: false,
                    log: false,
                });
            }
            Core.cancelRegisteredQuests();
            Core.jumpWait();
            Core.toBank(Reward.name);
        }
        Core.abandonQuest(this.questID);
    }
}

export default function main(): void {
    const script = new TheGreenWeaponSnack();
    Core.setOptions();

    script.getRewards();

    Core.setOptions(false);
}
