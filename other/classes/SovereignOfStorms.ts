/*
name: Sovereign Of Storms Class
description: This script will farm the Sovereign Of Storms class (without the ultras part).
tags: sos, sovereign, sovereignofstorms, lothian treasury, queen iona, iona, class
*/
// Port of Scripts/Other/Classes/SovereignOfStorms.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { LothianTreasuryMerge } from "../mergeshops/LothianTreasuryMerge";

const Adv = new CoreAdvanced();
const LTM = new LothianTreasuryMerge();

export class SovereignOfStorms {
    getSOS(rankUpClass = true): void {
        if (Core.checkInventory("Sovereign of Storms")) {
            if (rankUpClass) {
                Adv.rankUpClass("Sovereign of Storms");
            }
            return;
        }

        LTM.buyAllMerge("Sovereign of Storms");

        if (rankUpClass) {
            Adv.rankUpClass("Sovereign of Storms");
        }
    }
}

export default function main(): void {
    const script = new SovereignOfStorms();
    Core.setOptions();

    script.getSOS();

    Core.setOptions(false);
}
