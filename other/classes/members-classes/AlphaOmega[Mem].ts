/*
name: AlphaOmega[Mem]
description: null
tags: null
*/
// Port of Scripts/Other/Classes/Members-CLasses/AlphaOmega[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { CoreFarms } from "../../../core/CoreFarms";

const Farm = new CoreFarms();
const Adv = new CoreAdvanced();

export class AlphaOmega {
    getAlphaOmega(rankUpClass = true): void {
        if (Core.checkInventory("Alpha Omega") || !Core.isMember) {
            return;
        }

        Farm.bludrutBrawlBoss("Combat Trophy", 300);
        Core.buyItem("digitalmain", 561, "Alpha Omega");

        if (rankUpClass) {
            Adv.rankUpClass("Alpha Omega");
        }
    }
}

export default function main(): void {
    const script = new AlphaOmega();
    Core.setOptions();

    script.getAlphaOmega();

    Core.setOptions(false);
}
