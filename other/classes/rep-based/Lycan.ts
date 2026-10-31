/*
name: Lycan
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/Lycan.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";
import { Core13LoC } from "../../../story/lordsofchaos/Core13LoC";

const Farm = new CoreFarms();
const LOC = new Core13LoC();
const Adv = new CoreAdvanced();

export class Lycan {
    getLycan(rankUpClass = true): void {
        if (Core.checkInventory("Lycan")) {
            return;
        }

        LOC.wolfwing();
        Farm.lycanREP();

        Core.buyItem("lycan", 161, "Lycan");

        if (rankUpClass) {
            Adv.rankUpClass("Lycan");
        }
    }
}

export default function main(): void {
    const script = new Lycan();
    Core.setOptions();

    script.getLycan();

    Core.setOptions(false);
}
