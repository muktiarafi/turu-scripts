/*
name: DarknessShard
description: null
tags: null
*/
// Port of Scripts/Other/Materials/DarknessShard.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreDailies } from "../../core/CoreDailies";

const Dailies = new CoreDailies();

export class DarknessShard {
    getShard(quant = 3): void {
        if (Core.checkInventory("Darkness Shard", quant)) {
            return;
        }

        if (!Core.checkInventory("Crypto Token", 3)) {
            Dailies.cryptoToken();
        }
        Core.buyItem("curio", 1539, "Darkness Shard", 3);
    }
}

export default function main(): void {
    const script = new DarknessShard();
    Core.setOptions();

    script.getShard();

    Core.setOptions(false);
}
