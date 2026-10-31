/*
name: Exalted Harbinger (Class)
description: This script will get Exalted Harbinger class.
tags: exalted, harbinger, exaltedharbinger, seasonal, dage, class, dark birthday token, darkbirthday
*/
// Port of Scripts/Seasonal/StaffBirthdays/DageTheEvil/ExaltedHarbinger.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";
import { DarkBirthdayTokenMerge } from "./DarkBirthdayTokenMerge";

const Adv = new CoreAdvanced();
const DBTM = new DarkBirthdayTokenMerge();

export class ExaltedHarbinger {
    getEH(rankUpClass = true): void {
        if (Core.checkInventory("Exalted Harbinger") || !Core.isSeasonalMapActive("darkbirthday")) {
            Core.logger("You already own Exalted Harbinger or the map is unavailable.");

            if (rankUpClass) {
                Adv.rankUpClass("Exalted Harbinger");
            }
            return;
        }

        DBTM.buyAllMerge("Exalted Harbinger");

        if (rankUpClass) {
            Adv.rankUpClass("Exalted Harbinger");
        }
    }
}

export default function main(): void {
    const script = new ExaltedHarbinger();
    Core.setOptions();

    script.getEH();

    Core.setOptions(false);
}
