/*
name: BallyCool's Generosity Coins
description: This will complete the quest that gets you 2 free Generosity Coins.
tags: ballyhoo,bally-hoo,ballycool,generosity,gc,generositycoin,generosity coin,coins, seasonal, frostvale
*/
// Port of Scripts/Seasonal/Frostvale/BallyhooGenerosityCoins.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { ChillysQuest } from "./ChillysParticipation";

const Chillys = new ChillysQuest();

export class BallyhooGC {
    getCoins(): void {
        if (Core.isCompletedBefore(10016) || !Core.isSeasonalMapActive("frostvale")) {
            return;
        }

        Chillys.chillysParticipation();
        Core.addDrop("Generosity Coin");
        Core.ensureAccept(10016);
        Core.huntMonsterMapID("battleontown", 1, "Stolen Bag of Coins");
        Core.ensureComplete(10016);
    }
}

export default function main(): void {
    const script = new BallyhooGC();
    Core.setOptions();

    script.getCoins();

    Core.setOptions(false);
}
