/*
name: Easter Egg House
description: This will finish the Bring me the MULTICOLORED Egg quest to obtain the Easter Egg House.
tags: easter-egg-house, bring-me-the-multicoloredeggs, seasonal, easter
*/
// Port of Scripts/Seasonal/Grenwog(Easter)/BringmetheMULTICOLOREDEggs!(House).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class EasterEggHouse {
    getMulticoloredEggs(): void {
        if (bot.house.contains("Easter Egg House")) {
            Core.logger("You already own this house, stopping bot.");
            return;
        }

        Core.addDrop("Multicolored Grenwog Egg");

        Core.ensureAccept(5788);
        Core.huntMonster("DarkoviaGrave", "Rainbow Chick", "Rainbow Chick");
        Core.getMapItem(5226, 20, "DarkoviaGrave");
        Core.ensureCompleteChoose(5788);
    }
}

export default function main(): void {
    const script = new EasterEggHouse();
    Core.setOptions();

    script.getMulticoloredEggs();

    Core.setOptions(false);
}
