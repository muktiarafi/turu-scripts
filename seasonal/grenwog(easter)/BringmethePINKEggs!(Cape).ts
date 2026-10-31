/*
name: The Eggcubator
description: This will finish the Bring me the PINK Eggs! quest to obtain The Eggcubator Cape.
tags: the-eggcubator, bring-me-the-pink-eggs, seasonal, easter
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/BringmethePINKEggs!(Cape).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class TheEggcubator {
    getPINKEggs(): void {
        if (Core.checkInventory("The Eggcubator")) {
            Core.logger("You already own this item, Stopping Bot.");
            return;
        }

        Core.ensureAccept(5784);
        Core.huntMonster("Mythsong", "Pink Chick", "Pink Chick");
        Core.getMapItem(5222, 2, "Mythsong");
        Core.ensureCompleteChoose(5784);
    }
}

export default function main(): void {
    const script = new TheEggcubator();
    Core.setOptions();

    script.getPINKEggs();

    Core.setOptions(false);
}
