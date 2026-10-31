/*
name: Renegade[Mem]
description: This script will get Renegade class.
tags: renegade, member, class, metrea
*/
// Port of Scripts/Other/Classes/Members-CLasses/Renegade[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class Renegade {
    getclass(rankUpClass = true): void {
        if (Core.checkInventory(410, undefined, { toInv: false }) || !Core.isMember) {
            return;
        }

        if (!Core.checkInventory(15652)) {
            Adv.buyItem("trainers", 172, 15652);
        }
        // Rogue
        Adv.rankUpClass("Rogue");

        Adv.buyItem("trainers", 173, 410);
        if (rankUpClass) {
            Adv.rankUpClass("Renegade");
        }
    }
}

export default function main(): void {
    const script = new Renegade();
    Core.setOptions();

    script.getclass();

    Core.setOptions(false);
}
