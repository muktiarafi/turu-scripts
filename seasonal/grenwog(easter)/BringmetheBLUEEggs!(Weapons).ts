/*
name: Steampunk Weapons
description: This will finish the Bring me the BLUE Eggs quest to obtain all of the steampunk weapons.
tags: steampunk-weapons, bring-me-the-blue-eggs, seasonal, easter
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/BringmetheBLUEEggs!(Weapons).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class BlueEggs {
    getBlueEggs(): void {
        const RewardOptions = Core.ensureLoad(5786).rewards;
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
            Core.ensureAccept(5786);
            Core.huntMonster("EarthStorm", "Blue Chick", "Blue Chick");
            Core.getMapItem(5224, 6, "EarthStorm");
            Core.ensureCompleteChoose(5786);
            bot.wait.forPickup("*");
        }
    }
}

export default function main(): void {
    const script = new BlueEggs();
    Core.setOptions();

    script.getBlueEggs();

    Core.setOptions(false);
}
