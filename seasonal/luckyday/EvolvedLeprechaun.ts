/*
name: Evolved Leprechaun (Seasonal) Class
description: This script farms the Evolved Leprechaun class.
tags: seasonal, class, leprechaun, lucky day, shamrock
*/
// Port of Scripts/Seasonal/LuckyDay/EvolvedLeprechaun.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { LuckyDayShamrockFairMerge } from "./LuckyDayShamrockFairMerge";

const Adv = new CoreAdvanced();
const LDSFM = new LuckyDayShamrockFairMerge();
const Daily = new CoreDailies();

export class EvolvedLeprechaun {
    getClass(rankUpClass = true): void {
        if (
            Core.checkInventory("Evolved Leprechaun") ||
            (Core.checkInventory("Evolved Leprechaun") &&
                !Daily.checkDailyv2(Core.checkInventory(971) ? 1761 : 1759)) ||
            !Core.isSeasonalMapActive("luck")
        ) {
            Core.logger(
                Core.checkInventory("Evolved Leprechaun")
                    ? "You already own Evolved Leprechaun class."
                    : "This class is only available during the Good Luck Day event.",
            );
            return;
        }

        LDSFM.buyAllMerge("Evolved Leprechaun");

        if (rankUpClass) {
            Adv.rankUpClass("Evolved Leprechaun");
        }
    }
}

export default function main(): void {
    const script = new EvolvedLeprechaun();
    Core.setOptions();

    script.getClass();
    Core.setOptions(false);
}
