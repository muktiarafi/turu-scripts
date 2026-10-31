/*
name: TrollSpellsmith
description: null
tags: null
*/
// Port of Scripts/Other/Classes/REP-based/TrollSpellsmith.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class TrollSpellsmith {
    getTS(rankUpClass = true): void {
        if (Core.checkInventory("Troll Spellsmith")) {
            return;
        }

        Adv.buyItem("bloodtusk", 306, "Troll Spellsmith");

        if (rankUpClass) {
            Adv.rankUpClass("Troll Spellsmith");
        }
    }
}

export default function main(): void {
    const script = new TrollSpellsmith();
    Core.setOptions();

    script.getTS();

    Core.setOptions(false);
}
