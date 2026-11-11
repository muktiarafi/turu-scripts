/*
name: LightMage
description: null
tags: null
*/
// Port of Scripts/Other/Classes/LightMage.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class LightMage {
    getLM(rankUpClass = true): void {
        if (Core.checkInventory("LightMage")) {
            return;
        }

        Core.buyItem("celestialrealm", 1353, "Evolved LightCaster");
        Core.buyItem("celestialrealm", 1613, "LightMage Class Token A");
        Core.buyItem("celestialrealm", 1612, 44838, undefined, 4885, 1);

        if (rankUpClass) {
            Adv.rankUpClass("LightMage");
        }
    }
}

export default function main(): void {
    const script = new LightMage();
    Core.setOptions();

    script.getLM();

    Core.setOptions(false);
}
