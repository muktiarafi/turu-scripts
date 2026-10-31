/*
name: Necrotic Sword of the Abyss
description: This will farm the required materials and buy the item.
tags: necrotic sword of the abyss, nation, boosted item, nsoa, nsod
*/
// Port of Scripts/Nation/Various/NecroticSwordoftheAbyss.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreNSOD } from "../../evil/nsod/CoreNSOD";
import { CoreNation } from "../CoreNation";
import { CoreVHL } from "../vhl/CoreVHL";

const Adv = new CoreAdvanced();
const VHL = new CoreVHL();
const NSOD = new CoreNSOD();
const Nation = new CoreNation();

export class NSoA {
    getNSoA(): void {
        if (Core.checkInventory("Necrotic Sword of the Abyss")) {
            return;
        }

        NSOD.getNSOD();

        VHL.vhlChallenge(2);

        VHL.vhlCrystals();

        Adv.buyItem("tercessuinotlim", 1355, "Necrotic Sword of the Abyss");
    }
}

export default function main(): void {
    const script = new NSoA();
    Core.bankingBlackList.push(...Nation.bagDrops);
    Core.setOptions();

    script.getNSoA();

    Core.setOptions(false);
}
