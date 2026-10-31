/*
name: DarkbloodStormKing
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/DarkbloodStormKing.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { Core13LoC } from "../../../story/lordsofchaos/Core13LoC";

const Adv = new CoreAdvanced();
const LOC = new Core13LoC();

export class DarkbloodStormKing {
    getDSK(rankUpClass = true): void {
        if (Core.checkInventory("Darkblood StormKing")) {
            return;
        }

        LOC.lionfang();

        Adv.buyItem("stormtemple", 544, "Darkblood StormKing", undefined, 10412);

        if (rankUpClass) {
            Adv.rankUpClass("Darkblood StormKing");
        }
    }
}

export default function main(): void {
    const script = new DarkbloodStormKing();
    Core.setOptions();

    script.getDSK();

    Core.setOptions(false);
}
