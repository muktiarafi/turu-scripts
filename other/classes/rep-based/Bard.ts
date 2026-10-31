/*
name: Bard
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/Bard.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";
import { Core13LoC } from "../../../story/lordsofchaos/Core13LoC";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const LOC = new Core13LoC();

export class Bard {
    getBard(rankUpClass = true): void {
        if (Core.checkInventory("Bard")) {
            return;
        }

        LOC.kimberly();
        Farm.mythsongREP(4);

        Core.buyItem("mythsong", 186, "Bard");

        if (rankUpClass) {
            Adv.rankUpClass("Bard");
        }
    }
}

export default function main(): void {
    const script = new Bard();
    Core.setOptions();

    script.getBard();

    Core.setOptions(false);
}
