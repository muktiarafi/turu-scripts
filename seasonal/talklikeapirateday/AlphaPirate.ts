/*
name: Alpha Pirate Class
description: This will merge the Alpha Pirate Class Token.
tags: merge-shop, alpha, pirate, class
*/
// Port of Scripts/Seasonal/TalkLikeaPirateDay/AlphaPirate.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { BlazebeardMerge } from "./mergeshops/BlazeBeardMerge";

const Adv = new CoreAdvanced();
const BBM = new BlazebeardMerge();

export class AlphaPirate {
    getAlphaPirate(rankUpClass = true): void {
        if (Core.checkInventory("Alpha Pirate") || !Core.isSeasonalMapActive("blazebeard")) {
            return;
        }

        if (!Core.checkInventory(["Alpha Pirate Class Token ", "Classic Alpha Pirate"], undefined, { any: true })) {
            Core.logger(
                "This script *REQUIRES* the `Classic ALpha Pirate` Class ( with 1 point into it ) to be able to do the `Alpha Pirate` merge, cannot continue.",
            );
            return;
        }

        BBM.buyAllMerge("Alpha Pirate");

        if (rankUpClass) {
            Adv.rankUpClass("Alpha Pirate");
        }
    }
}

export default function main(): void {
    const script = new AlphaPirate();
    Core.setOptions();

    script.getAlphaPirate();

    Core.setOptions(false);
}
