/*
name: Search For Gifts Quest Rewards
description: This script will get all the rewards of search for gifts quest.
tags: search, for, gifts, rewards, seasonal, akibalight, ai no miko
*/
// Port of Scripts/Seasonal/FrostvalInJuly/SearchForGiftsRewards.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { FrostBladeMaster } from "./frostblademaster";

const FBM = new FrostBladeMaster();

export class SearchForGiftsRewards {
    searchForGifts(): void {
        FBM.sagaName();

        if (!Core.isSeasonalMapActive("akibalight")) {
            return;
        }

        const rewards = Core.questRewards(6992);
        if (Core.checkInventory(rewards, undefined, { toInv: false })) {
            return;
        }

        Core.addDrop(...rewards);

        Core.registerQuests(6992);
        while (!bot.shouldExit && !Core.checkInventory(rewards)) {
            Core.huntMonster("bamboo", "Bamboo Wisp", "Red-Wrapped Gift", 5);
        }
        Core.cancelRegisteredQuests();
        Core.toBank(...rewards);
    }
}

export default function main(): void {
    const script = new SearchForGiftsRewards();
    Core.setOptions();

    script.searchForGifts();
    Core.setOptions(false);
}
