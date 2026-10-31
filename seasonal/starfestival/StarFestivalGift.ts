/*
name: Star Festival Gift
description: This bot will get you all the rewards from the quest for the 'Star Festival Gift' quest in /starfestival
tags: star, festival, gift, yokai, river, fallen, moon, bow, ninja
*/
// Port of Scripts/Seasonal/StarFestival/StarFestivalGift.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";

export class StarFestivalGift {
    getGifts(): void {
        const rewards = Core.questRewards(6449);
        if (Core.checkInventory(rewards) || !Core.isSeasonalMapActive("starfest")) {
            return;
        }

        Core.addDrop(...rewards);
        Core.registerQuests(6449);
        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.huntMonster("starfest", "Fallen Star", "Fallen Star", 7, { log: false });
        }
        Core.cancelRegisteredQuests();
    }
}

export default function main(): void {
    const script = new StarFestivalGift();
    Core.setOptions();

    script.getGifts();

    Core.setOptions(false);
}
