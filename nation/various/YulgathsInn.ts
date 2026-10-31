/*
name: YulgathsInn
description: null
tags: null
*/
// Port of Scripts/Nation/Various/YulgathsInn.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class YulgathsInn {
    gettInn(): void {
        if (Core.checkInventory("Yulgath's Inn")) {
            return;
        }

        // Merge the following:
        if (!Core.checkInventory("Yulgath's Hut")) {
            Core.addDrop("Yulgath's Hut");
            Core.logger(`Hunting Fiend Champion for Yulgath's Hut, (0/1) [Temp = False]`);

            while (!Core.checkInventory("Yulgath's Hut")) {
                Core.huntMonster("originul", "Fiend Champion", undefined, undefined, { log: false });
            }
        }
        Nation.farmUni10(400);
        Nation.farmTaintedGem(200);
        Nation.farmDarkCrystalShard(250);
        Nation.farmDiamondofNulgath(200);
        Nation.farmUni13(1);
        Nation.farmVoucher({ member: false });
        // Into:
        Core.buyItem("archportal", 1211, "Yulgath's Inn");
    }
}

export default function main(): void {
    const script = new YulgathsInn();
    Core.setOptions();

    script.gettInn();

    Core.setOptions(false);
}
