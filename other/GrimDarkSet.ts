/*
name: Grim Dark Set
description: farms the "Grim Dark" set from Quest: "Doom Regin Doom’s Reward".
tags: doom, region, doom, reward, grim, dark, set
*/
// Port of Scripts/Other/GrimDarkSet.cs.

import { bot } from "turu";
import { ClassType, Core } from "../core/CoreBots";
import { MustyCave } from "../story/MustyCave";

const Cave = new MustyCave();

export class GrimDarkSet {
    getAll(): void {
        if (!bot.quests.isUnlocked(7049)) {
            Cave.storyline();
        }

        const RewardOptions = Core.ensureLoad(7049).rewards;

        for (const item of RewardOptions) {
            Core.addDrop(item.name);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.name, undefined, { toInv: false })) {
                // C# returns here, so the rewards after the first one you own were never farmed.
                continue;
            }
            Core.farmingLogger(Reward.name, 1);

            while (!bot.shouldExit && !Core.checkInventory(Reward.name)) {
                Core.ensureAccept(7049);
                Core.huntMonster("mustycave", "Mogdring", "Golden Gear", 5, { isTemp: false });
                Core.huntMonster("mustycave", "Spy Drone", "Aura Core", 25, { isTemp: false });
                Core.huntMonster("mustycave", "Guard Drone", "Dimension Stabilizer", 35, { isTemp: false });
                Core.ensureComplete(7049, Reward.id);
                Core.jumpWait();
                Core.toBank(Reward.name);
            }
        }
    }
}

export default function main(): void {
    const script = new GrimDarkSet();
    Core.setOptions();

    script.getAll();

    Core.setOptions(false);
}
