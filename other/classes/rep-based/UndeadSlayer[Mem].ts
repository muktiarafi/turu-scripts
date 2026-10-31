/*
name: UndeadSlayer[Mem]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/UndeadSlayer[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class UndeadSlayer {
    getUS(rankUpClass = true): void {
        if (Core.checkInventory("UndeadSlayer")) {
            return;
        }
        if (!Core.isMember) {
            return;
        }

        Farm.doomWoodREP();

        Core.buyItem("necropolis", 408, "UndeadSlayer");

        if (rankUpClass) {
            Adv.rankUpClass("UndeadSlayer");
        }
    }
}

export default function main(): void {
    const script = new UndeadSlayer();
    Core.setOptions();

    script.getUS();

    Core.setOptions(false);
}
