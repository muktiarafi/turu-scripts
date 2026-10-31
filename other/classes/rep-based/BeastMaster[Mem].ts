/*
name: BeastMaster[Mem]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/BeastMaster[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class BeastMaster {
    getBM(rankUpClass = true): void {
        if (Core.checkInventory("BeastMaster")) {
            return;
        }

        Adv.buyItem("northpointe", 976, "BeastMaster", undefined, 16031);

        if (rankUpClass) {
            Adv.rankUpClass("BeastMaster");
        }
    }
}

export default function main(): void {
    const script = new BeastMaster();
    Core.setOptions();

    script.getBM();

    Core.setOptions(false);
}
