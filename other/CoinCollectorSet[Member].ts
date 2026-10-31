/*
name: coin collector set
description: Farms the coin collector set from hollowhalls
tags: coin collector, set
*/
// Port of Scripts/Other/CoinCollectorSet[Member].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../core/CoreAdvanced";
import { Core } from "../core/CoreBots";

const Adv = new CoreAdvanced();

export class CoinCollectorSet {
    getItems(): void {
        this.armor();
        this.weapon();
        this.helm();
    }

    armor(): void {
        if (Core.checkInventory("Coin Collector", undefined, { toInv: false })) {
            return;
        }

        Adv.buyItem("hyperspace", 194, "Le Chocolat");
        Core.buyItem("hollowhalls", 335, "Coin Collector");
        Core.toBank("Coin Collector");
    }

    weapon(): void {
        if (Core.checkInventory("Coin Collector Gun", undefined, { toInv: false })) {
            return;
        }

        Adv.buyItem("hyperspace", 194, "Chocolate Doubloon");
        Core.buyItem("hollowhalls", 335, "Coin Collector Gun");
        Core.toBank("Coin Collector Gun");
    }

    helm(): void {
        if (Core.checkInventory("Coin Collector Helmet", undefined, { toInv: false })) {
            return;
        }

        Adv.buyItem("hyperspace", 194, "Chocolate Loonie");
        Core.buyItem("hollowhalls", 335, "Coin Collector Helmet");
        Core.toBank("Coin Collector Helmet");
    }
}

export default function main(): void {
    const script = new CoinCollectorSet();
    Core.setOptions();

    script.getItems();

    Core.setOptions(false);
}
