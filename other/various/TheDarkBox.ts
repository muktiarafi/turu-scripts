/*
name: TheDarkBox
description: null
tags: null
*/
// Port of Scripts/Other/Various/TheDarkBox.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class TheDarkBox {
    example(): void {
        const RewardOptions = Core.ensureLoad(8375).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }

        const Rewards = [...RewardsList];
        bot.drops.add(...Rewards);

        if (
            Core.checkInventory(Rewards, undefined, { toInv: false }) ||
            !Core.checkInventory(["Dark Box", "Dark Key"])
        ) {
            return;
        }

        //The Dark Box 5710
        Core.registerQuests(5710);
        while (!bot.shouldExit && !Core.checkInventory(Rewards, undefined, { toInv: false })) {
            if (Core.isMember) {
                Core.huntMonster("ruins", "Dark Elemental", "Dark Gem", undefined, { isTemp: false });
            } else {
                Core.huntMonster("darkfortress", "Dark Elemental", "Dark Gem", undefined, { isTemp: false });
            }
            Core.jumpWait();
            Core.toBank(...Rewards);
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new TheDarkBox();
    Core.setOptions();

    script.example();

    Core.setOptions(false);
}
