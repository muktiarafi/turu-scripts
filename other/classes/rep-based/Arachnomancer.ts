/*
name: Arachnomancer
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/Arachnomancer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";
import { RavenlossSaga } from "../../../story/RavenlossSaga";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();
const ravenlossSaga = new RavenlossSaga();

export class Arachnomancer {
    getArach(rankUpClass = true): void {
        if (Core.checkInventory("Arachnomancer")) {
            if (rankUpClass) {
                Adv.rankUpClass("Arachnomancer");
            }
            return;
        }

        ravenlossSaga.doAll();
        Farm.ravenlossREP();

        Core.buyItem("ravenloss", 850, "Arachnomancer", undefined, 14837);

        if (rankUpClass) {
            Adv.rankUpClass("Arachnomancer");
        }
    }
}

export default function main(): void {
    const script = new Arachnomancer();
    Core.setOptions();

    script.getArach();

    Core.setOptions(false);
}
