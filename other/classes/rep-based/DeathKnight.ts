/*
name: DeathKnight
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/DeathKnight.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class DeathKnight {
    getDK(rankUpClass = true): void {
        if (Core.checkInventory("DeathKnight") || !Core.isMember) {
            return;
        }

        Farm.doomWoodREP();

        Core.buyItem("necropolis", 408, "DeathKnight", undefined, 8079);

        if (rankUpClass) {
            Adv.rankUpClass("DeathKnight");
        }
    }
}

export default function main(): void {
    const script = new DeathKnight();
    Core.setOptions();

    script.getDK();

    Core.setOptions(false);
}
