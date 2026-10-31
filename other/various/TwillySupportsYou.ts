/*
name: Twilly Supports You!
description: This script does the quest [9779] "Twilly Supports You!" and gets the rewards.
tags: twilly, supports, you, quest, 9779, rewards, chickencow, take twilly's money, extremely enthusiastic hero
*/
// Port of Scripts/Other/Various/TwillySupportsYou.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { ClassType, Core } from "../../core/CoreBots";

export class TwillySupportsYou {
    getDrops(): void {
        if (
            !Core.checkInventory("Twilly Supports You!") ||
            Core.checkInventory(
                Core.ensureLoad(9779).rewards.map((x) => x.name),
                undefined,
                { toInv: false },
            )
        ) {
            Core.logger('You either don\'t have the "Twilly Supports You!" pet or already have the rewards.');
            return;
        }

        const RewardOptions = Core.ensureLoad(9779).rewards;

        for (const item of RewardOptions.filter(
            (x) => x != null && !Core.checkInventory(x.id, undefined, { toInv: false }),
        )) {
            bot.drops.add(item.id);
        }

        Core.equipClass(ClassType.Farm);

        for (const Reward of RewardOptions) {
            if (Core.checkInventory(Reward.id, undefined, { toInv: false })) {
                continue;
            }

            Core.farmingLogger(Reward.name, 1);

            Core.ensureAccept(9779);

            Core.huntMonster("battlefowl", "Chickencow", "Sammich", undefined, { log: false });

            Core.ensureComplete(9779, Reward.id);
            Core.jumpWait();
            Core.toBank(Reward.id);
        }
    }
}

export default function main(): void {
    const script = new TwillySupportsYou();
    Core.setOptions();

    script.getDrops();

    Core.setOptions(false);
}
