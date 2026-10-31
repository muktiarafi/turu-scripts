/*
name: ImperialChunin
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/ImperialChunin.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class ImperialChunin {
    getIC(rankUpClass = true): void {
        if (Core.checkInventory("Imperial Chunin")) {
            return;
        }

        Farm.yokaiREP();

        Core.buyItem("dragonkoiz", 95, "Imperial Chunin");

        if (rankUpClass) {
            Adv.rankUpClass("Imperial Chunin");
        }
    }
}

export default function main(): void {
    const script = new ImperialChunin();
    Core.setOptions();

    script.getIC();

    Core.setOptions(false);
}
