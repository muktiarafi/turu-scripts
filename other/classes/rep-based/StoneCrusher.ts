/*
name: StoneCrusher
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/StoneCrusher.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";
import { Core13LoC } from "../../../story/lordsofchaos/Core13LoC";
import { BrightOak } from "../../../story/queenofmonsters/extra/BrightOak";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const LOC = new Core13LoC();
const Oak = new BrightOak();

export class StoneCrusher {
    getSC(rankUpClass = true): void {
        if (Core.checkInventory("StoneCrusher")) {
            if (rankUpClass) {
                Adv.rankUpClass("StoneCrusher");
            }
            return;
        }

        LOC.kimberly();
        Oak.doall();
        Farm.mythsongREP();
        Adv.buyItem("Gaiazor", 1210, 33394, undefined, 4222);

        if (rankUpClass) {
            Adv.rankUpClass("StoneCrusher");
        }
    }
}

export default function main(): void {
    const script = new StoneCrusher();
    Core.setOptions();

    script.getSC();

    Core.setOptions(false);
}
