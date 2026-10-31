/*
name: Sweet Birthday Treats Rewards
description: This will do the Sweet Birthday Treats quest and obtain all of the rewards.
tags: sweet-birthday-treats, seasonal, aqw-anniversary
*/
// Port of Scripts/Seasonal/AqwBirthday/SweatBirthdayTreatsRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class SweatBirthdayTreatsRewards {
    questFarming(): void {
        const RewardOptions = Core.ensureLoad(8906).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }

        const Rewards = [...RewardsList];
        bot.drops.add(...Rewards);

        if (Core.checkInventory(Rewards, undefined, { toInv: false })) {
            return;
        }

        let i = 0;

        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            //Sweet Birthday Treats 8906
            Core.ensureAccept(8906);

            Core.equipClass(ClassType.Solo);
            Core.huntMonster("birthday", "Twilly Pinata", "Pinata Candy", 100, { isTemp: false, log: false });

            Core.ensureComplete(8906);
            i++;

            if (i % 5 === 0) {
                Core.jumpWait();
                Core.toBank(...Rewards);
            }
        }
        Core.toBank(...Rewards);
    }
}

export default function main(): void {
    const script = new SweatBirthdayTreatsRewards();
    Core.setOptions();

    script.questFarming();

    Core.setOptions(false);
}
