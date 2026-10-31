/*
name: LegionCastle
description: null
tags: null
*/
// Port of Scripts/Legion/Various/LegionCastle.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";
import { CoreLegion } from "../CoreLegion";

const Daily = new CoreDailies();
const Legion = new CoreLegion();

export class GetLegionCastle {
    allYourBaseAreBelongToUs(): void {
        if (Core.checkInventory("Legion Castle")) {
            return;
        }

        Legion.farmLegionToken(25000);
        if (!Core.checkInventory("Shadow Shroud", 15)) {
            Daily.shadowShroud();
        }

        if (Core.checkInventory("Shadow Shroud", 15)) {
            Core.buyItem("Underworld", 238, "Legion Castle");
        }
    }
}

export default function main(): void {
    const script = new GetLegionCastle();
    Core.setOptions();

    script.allYourBaseAreBelongToUs();

    Core.setOptions(false);
}
