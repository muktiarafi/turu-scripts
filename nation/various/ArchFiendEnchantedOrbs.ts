/*
name: ArchFiendEnchantedOrbs
description: null
tags: null
*/
// Port of Scripts/Nation/Various/ArchFiendEnchantedOrbs.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { CoreAdvanced } from "../../core/CoreAdvanced";
import { Core } from "../../core/CoreBots";
import { CoreHollowborn } from "../../hollowborn/CoreHollowborn";
import { CoreNation } from "../CoreNation";

const Adv = new CoreAdvanced();
const Nation = new CoreNation();
const HB = new CoreHollowborn();

export class ArchFiendEnchantedOrbs {
    getAFEO(): void {
        if (Core.checkInventory("ArchFiend Enchanted Orbs")) {
            return;
        }

        Adv.buyItem("tercessuinotlim", 1951, "Unidentified 25");
        Nation.farmUni13(1);
        Nation.farmDiamondofNulgath(150);
        HB.freshSouls(1, 100);
        // Also has the uni36
        Nation.farmBloodGem(10);
        Nation.farmVoucher({ member: false });

        Core.buyItem("tercessuinotlim", 1820, "ArchFiend Enchanted Orbs");
    }
}

export default function main(): void {
    const script = new ArchFiendEnchantedOrbs();
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

    script.getAFEO();

    Core.setOptions(false);
}
