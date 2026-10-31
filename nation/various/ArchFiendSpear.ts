/*
name: ArchFiendSpear
description: null
tags: null
*/
// Port of Scripts/Nation/Various/ArchFiendSpear.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../../hollowborn/CoreHollowborn";
import { WillpowerExtraction } from "../afdl/WillpowerExtraction";
import { CoreNation } from "../CoreNation";
import { ArchFiendEnchantedOrbs } from "./ArchFiendEnchantedOrbs";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const HB = new CoreHollowborn();
const Will = new WillpowerExtraction();
const AFEO = new ArchFiendEnchantedOrbs();

export class ArchFiendSpear {
    getAFS(): void {
        if (Core.checkInventory("ArchFiend Spear")) {
            return;
        }

        Adv.buyItem("tercessuinotlim", 1951, "Unidentified 25");
        AFEO.getAFEO();
        Will.unidentified34(1);
        Nation.farmDiamondofNulgath(200);
        HB.freshSouls(1, 100);
        // Also has the uni36
        Nation.farmBloodGem(20);
        Nation.farmVoucher({ member: false });

        Core.buyItem("tercessuinotlim", 1820, "ArchFiend Spear");
    }
}

export default function main(): void {
    const script = new ArchFiendSpear();
    Core.bankingBlackList.push(
        ...Nation.bagDrops
            .concat(...Nation.tercessBags)
            .concat(
                "Unidentified 34",
                "Unidentified 19",
                "Necrot",
                "Chaoroot",
                "Doomatter",
                "Mortality Cape of Revontheus",
                "Facebreakers of Nulgath",
                "SightBlinder Axes of Nulgath",
                "Mystic Tribal Sword",
                "King Klunk's Crown",
                "Golden Shadow Breaker",
                "Shadow Terror Axe",
            ),
    );
    Core.setOptions();

    script.getAFS();

    Core.setOptions(false);
}
