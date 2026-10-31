/*
name: EternalInversionist
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/EternalInversionist.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreToD } from "../../../story/throneofdarkness/CoreToD";

const Adv = new CoreAdvanced();
const TOD = new CoreToD();

export class EternalInversionist {
    getEI(rankUpClass = true): void {
        if (Core.checkInventory(35602)) {
            return;
        }

        TOD.fourthDimensionalPyramid();
        Adv.buyItem("fourdpyramid", 1275, "Eternal Inversionist", undefined, 21138);
        if (rankUpClass) {
            Adv.gearStore(undefined, { enhAfter: true });
            Core.equip("Eternal Inversionist");
            Adv.rankUpClass("Eternal Inversionist");
            Adv.gearStore(true, { enhAfter: true });
        }
    }
}

export default function main(): void {
    const script = new EternalInversionist();
    Core.setOptions();

    script.getEI();

    Core.setOptions(false);
}
