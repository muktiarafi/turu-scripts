/*
name: Shadow Dragon Shinobi (Seasonal) Class
description: This script farms the Shadow Dragon Shinobi class.
tags: seasonal, class, shadow, dragon, black friday, shinobi
*/
// Port of Scripts/Seasonal/BlackFriday/ShadowDragonShinobi.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { ShadowDragonShinobiMerge } from "./ShadowDragonShinobiMerge";

const Adv = new CoreAdvanced();
const SDSM = new ShadowDragonShinobiMerge();

export class ShadowDragonShinobi {
    getClass(rankUpClass = true): void {
        if (Core.checkInventory("Shadow Dragon Shinobi") || !Core.isSeasonalMapActive("blackfridaywar")) {
            Core.logger(
                Core.checkInventory("Shadow Dragon Shinobi")
                    ? "You already own Shadow Dragon Shinobi class."
                    : "This class is only available during the Black Friday event.",
            );
            return;
        }

        SDSM.buyAllMerge("Shadow Dragon Shinobi");
        if (rankUpClass) {
            Adv.rankUpClass("Shadow Dragon Shinobi");
        }
    }
}

export default function main(): void {
    const script = new ShadowDragonShinobi();
    Core.setOptions();

    script.getClass();
    Core.setOptions(false);
}
