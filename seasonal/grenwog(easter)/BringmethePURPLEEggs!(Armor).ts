/*
name: Steampunk Eggsplorer Armor
description: This will finish the Bring me the PURPLE Eggs! quest to obtain the Steampunk Eggsplorer Armor.
tags: steampunk-eggsplorer-armor, bring-me-the-purple-eggs, seasonal, easter
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/BringmethePURPLEEggs!(Armor).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";

export class SteampunkEggsplorer {
    getPurpleEggs(): void {
        if (Core.checkInventory("Steampunk Eggsplorer")) {
            Core.logger("You already own this item, Stopping Bot.");
            return;
        }

        Core.addDrop("Purple Grenwog Egg");

        Core.ensureAccept(5787);
        Core.huntMonster("WaterStorm", "Purple Chick", "Purple Chick");
        Core.getMapItem(5225, 10, "WaterStorm");
        Core.ensureCompleteChoose(5787);
    }
}

export default function main(): void {
    const script = new SteampunkEggsplorer();
    Core.setOptions();

    script.getPurpleEggs();

    Core.setOptions(false);
}
