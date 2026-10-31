/*
name: HorcEvader
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/HorcEvader.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class HorcEvader {
    getHE(rankUpClass = true): void {
        if (Core.checkInventory("Horc Evader")) {
            return;
        }

        Adv.buyItem("bloodtusk", 308, "Horc Evader");

        if (rankUpClass) {
            Adv.rankUpClass("Horc Evader");
        }
    }
}

export default function main(): void {
    const script = new HorcEvader();
    Core.setOptions();

    script.getHE();

    Core.setOptions(false);
}
