/*
name: Vegetable Token Farm
description: Farms the max vegetable token quantity.
tags: vegetable-token, seasonal, april-fools
*/
// Port of Scripts/Seasonal/AprilFools/GardenQuestMerge(VegetableToken).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class GardenQuestMerge {
    getVegetableTokens(): void {
        if (!Core.isSeasonalMapActive("gardenquest")) {
            return;
        }
        Core.addDrop("Vegetable Token");
        Core.logger(`Hunting For: Vegetable Token, ${bot.inventory.getQuantity("Vegetable Token")}/300`);
        while (!bot.shouldExit && !Core.checkInventory("Vegetable Token", 300)) {
            Core.ensureAccept(8002);
            Core.huntMonster("GardenQuest", "Angry Broccoli", "Roasted Broccoli", undefined, { log: false });
            Core.ensureComplete(8002);
            Core.logger(`Vegetable Token: ${bot.inventory.getQuantity("Vegetable Token")}/300`);
        }
    }
}

export default function main(): void {
    const script = new GardenQuestMerge();
    Core.bankingBlackList.push("Vegetable Token");

    Core.setOptions();

    script.getVegetableTokens();

    Core.setOptions(false);
}
