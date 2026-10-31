/*
name: RoyalBattleMage
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/RoyalBattleMage.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class RoyalBattleMage {
    getRBM(rankUpClass = true): void {
        if (Core.checkInventory("Royal BattleMage")) {
            return;
        }

        Adv.buyItem("castle", 702, "Royal BattleMage");

        if (rankUpClass) {
            Adv.rankUpClass("Royal BattleMage");
        }
    }
}

export default function main(): void {
    const script = new RoyalBattleMage();
    Core.setOptions();

    script.getRBM();

    Core.setOptions(false);
}
