/*
name: Eggsplorer Helmets
description: This will finish the Bring me the GREEN Eggs quest to obtain the eggsplorer helmets.
tags: eggsplorer-helmet, bring-me-the-green-eggs, seasonal, easter
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/BringmetheGREENEggs!(Helms).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class GreenEggs {
    getGreenEggs(): void {
        const RewardOptions = Core.ensureLoad(5785).rewards;
        const RewardsList: string[] = [];
        for (const Item of RewardOptions) {
            RewardsList.push(Item.name);
        }

        const Rewards = [...RewardsList];

        Core.addDrop(...Rewards);

        if (Core.checkInventory(Rewards)) {
            Core.logger("You already own these items, Stopping Bot.");
            return;
        }

        while (!bot.shouldExit && !Core.checkInventory(Rewards)) {
            Core.ensureAccept(5785);
            Core.huntMonster("GreenGuardWest", "Green Chick", "Green Chick");
            Core.getMapItem(5223, 4, "GreenGuardWest");
            Core.ensureCompleteChoose(5785);
            bot.wait.forPickup("*");
        }
    }
}

export default function main(): void {
    const script = new GreenEggs();
    Core.setOptions();

    script.getGreenEggs();

    Core.setOptions(false);
}
