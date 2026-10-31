/*
name: Elemental Dracomancer Class
description: This script farms the Elemental Dracomancer class.
tags: dracomancer, class, etherstorm
*/
// Port of Scripts/Other/Classes/REP-based/ElementalDracomancer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../../core/CoreAdvanced";
import { Core } from "../../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ElementalDracomancer {
    getED(rankUpClass = true): void {
        if (Core.checkInventory("Elemental Dracomancer")) {
            Core.logger("You already own Elemental Dracomancer class.");
            return;
        }

        Adv.buyItem("dragontown", 1285, 11272);

        if (rankUpClass) {
            Adv.rankUpClass("Elemental Dracomancer");
        }
    }
}

export default function main(): void {
    const script = new ElementalDracomancer();
    Core.setOptions();

    script.getED();
    Core.setOptions(false);
}
