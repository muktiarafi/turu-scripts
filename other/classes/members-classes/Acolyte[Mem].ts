/*
name: Acolyte[Mem]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/Members-CLasses/Acolyte[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class Acolyte {
    getAcolyte(rankUpClass = true): void {
        if (!Core.isMember) {
            return;
        }

        if (Core.checkInventory("Acolyte")) {
            return;
        }

        if (Core.checkInventory("Healer")) {
            Core.buyItem("trainers", 176, "Healer");
            Adv.rankUpClass("Healer");
            Core.buyItem("trainers", 177, "Acolyte");
            if (rankUpClass) {
                Adv.rankUpClass("Acolyte");
            }
        }
    }
}

export default function main(): void {
    const script = new Acolyte();
    Core.setOptions();

    script.getAcolyte();

    Core.setOptions(false);
}
