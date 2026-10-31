/*
name: EvolvedShaman
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/EvolvedShaman.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class EvolvedShaman {
    getES(rankUpClass = true): void {
        if (Core.checkInventory("Evolved Shaman")) {
            return;
        }

        Farm.arcangroveREP();

        Core.buyItem("arcangrove", 214, "Evolved Shaman", undefined, 6396);

        if (rankUpClass) {
            Adv.rankUpClass("Evolved Shaman");
        }
    }
}

export default function main(): void {
    const script = new EvolvedShaman();
    Core.setOptions();

    script.getES();

    Core.setOptions(false);
}
