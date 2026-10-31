/*
name: ProtoSartorium (Class)
description: This script will get ProtoSartorium class.
tags: proto sartorium, protosartorium, mithril man, dwakel, class
*/
// Port of Scripts/Other/Classes/ProtoSartorium.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class ProtoSartorium {
    getPS(rankUpClass = true): void {
        if (Core.checkInventory("ProtoSartorium") || !Core.isMember) {
            if (rankUpClass && Core.isMember) {
                Adv.rankUpClass("ProtoSartorium");
            }
            return;
        }

        Core.addDrop("ProtoSartorium");

        Core.huntMonster("crashsite", "ProtoSartorium", "ProtoSartorium", undefined, { isTemp: false });

        if (rankUpClass) {
            Adv.rankUpClass("ProtoSartorium");
        }
    }
}

export default function main(): void {
    const script = new ProtoSartorium();
    Core.setOptions();

    script.getPS();

    Core.setOptions(false);
}
