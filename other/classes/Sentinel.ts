/*
name: Sentinel
description: null
tags: null
*/
// Port of Scripts/Other/Classes/Sentinel.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class Sentinel {
    getSentinel(rankUpClass = true): void {
        Core.logger(Core.hasWebBadge("16h Upholder") || Core.hasWebBadge("16th Upholder") ? "true" : "false");
        if (
            (Core.hasWebBadge("16h Upholder") || Core.hasWebBadge("16th Upholder")) &&
            Core.checkInventory("Sentinel")
        ) {
            if (rankUpClass) {
                Adv.rankUpClass("Sentinel");
            }
            return;
        }

        Core.buyItem(bot.map.name, 2491, "Sentinel");

        if (rankUpClass) {
            Adv.rankUpClass("Sentinel");
        }
    }
}

export default function main(): void {
    const script = new Sentinel();
    Core.setOptions();

    script.getSentinel();

    Core.setOptions(false);
}
