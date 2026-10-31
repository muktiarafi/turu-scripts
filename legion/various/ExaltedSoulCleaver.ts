/*
name: Exalted Soul Cleaver
description: This scripts farms the Exalted Soul Cleaver class.
tags: exalted, soul, cleaver, legion, class, esc, dage, undead legion merge
*/
// Port of Scripts/Legion/Various/ExaltedSoulCleaver.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { UndeadLegionMerge } from "../mergeshops/UndeadLegionMerge";

const ULM = new UndeadLegionMerge();
const Adv = new CoreAdvanced();

export class ExaltedSoulCleaver {
    getClass(rankUpClass = true): void {
        if (Core.checkInventory("Exalted Soul Cleaver")) {
            Core.logger("You already own Exalted Soul Cleaver class.");
            return;
        }

        ULM.buyAllMerge("Exalted Soul Cleaver");

        if (rankUpClass) {
            Adv.rankUpClass("Exalted Soul Cleaver");
        }
    }
}

export default function main(): void {
    const script = new ExaltedSoulCleaver();
    Core.setOptions();

    script.getClass();
    Core.setOptions(false);
}
