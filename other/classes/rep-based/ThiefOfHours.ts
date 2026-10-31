/*
name: ThiefOfHours
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/ThiefOfHours.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class ThiefOfHours {
    getToH(rankUpClass = true): void {
        if (Core.checkInventory("Thief of Hours")) {
            return;
        }

        Farm.chronoSpanREP();

        Core.buyItem("thespan", 439, "Thief of Hours");

        if (rankUpClass) {
            Adv.rankUpClass("Thief of Hours");
        }
    }
}

export default function main(): void {
    const script = new ThiefOfHours();
    Core.setOptions();

    script.getToH();

    Core.setOptions(false);
}
