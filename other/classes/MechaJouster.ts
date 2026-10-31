/*
name: MechaJouster (Class)
description: This script will get MechaJouster class.
tags: jouster, mechajouster, treasure potion, class, mecha jouster
*/
// Port of Scripts/Other/Classes/MechaJouster.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";

const Adv = new CoreAdvanced();

export class MechaJouster {
    getMJ(rankUpClass = true): void {
        if (Core.checkInventory("MechaJouster")) {
            if (rankUpClass) {
                Adv.rankUpClass("MechaJouster");
            }
            return;
        }

        if (!Core.checkInventory("Jouster")) {
            Core.logger(
                "In order to get MechaJouster class you need to have Jouster armor in your inventory, buy it from Doom Merge.",
            );
            return;
        }

        Core.addDrop("MechaJouster");

        Core.ensureAccept(3355);
        Core.huntMonster("airstorm", "Lightning Ball", "Energy Orb");
        Core.ensureComplete(3355);

        if (rankUpClass) {
            Adv.rankUpClass("MechaJouster");
        }
    }
}

export default function main(): void {
    const script = new MechaJouster();
    Core.setOptions();

    script.getMJ();

    Core.setOptions(false);
}
