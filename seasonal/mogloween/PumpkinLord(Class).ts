/*
name: (Class) Pumpkin Lord
description: This script will get Pumpkin Lord class.
tags: class, mogloween, seasonal, pumpkin, pumpkin lord, pumpkinlord
*/
// Port of Scripts/Seasonal/Mogloween/PumpkinLord(Class).cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { ClassType, Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class PumpkinLord {
    getClass(rankUpClass = false): void {
        if (
            !Core.isSeasonalMapActive("mogloween") ||
            Core.checkInventory("Pumpkin Lord", undefined, { toInv: false })
        ) {
            return;
        }

        Core.equipClass(ClassType.Solo);

        Core.huntMonster("mogloween", "Great Pumpkin King", "Pumpkin Lord", undefined, { isTemp: false });

        if (rankUpClass) {
            Adv.rankUpClass("Pumpkin Lord");
        }
    }
}

export default function main(): void {
    const script = new PumpkinLord();
    Core.setOptions();

    script.getClass(true);

    Core.setOptions(false);
}
