/*
name: ShadowLegacyofNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/Various/ShadowLegacyofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { bot } from "turu";
import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";
import { CoreNation } from "../CoreNation";

const Farm = new CoreFarms();
const Nation = new CoreNation();

export class ShadowLegacyofNulgath {
    getSLoN(): void {
        if (Core.checkInventory("Shadow Legacy of Nulgath")) {
            return;
        }

        Core.addDrop("Shadow Legacy of Nulgath", "Letter from Asuka and Tendou");

        Nation.approvalAndFavor(100, 0);
        Nation.supplies("Voucher of Nulgath (non-mem)");
        Nation.essenceofNulgath(100);
        Core.killMonster("tercessuinotlim", "m4", "Right", "Shadow of Nulgath", "Hadean Onyx of Nulgath", 1, {
            isTemp: false,
        });
        Core.huntMonster("Citadel", "Burning Witch", "Letter from Asuka and Tendou", undefined, { isTemp: false });
        Farm.gold(3000000);
        Core.buyItem("archportal", 1211, "Shadow Legacy of Nulgath");
        bot.wait.forPickup("Shadow Legacy of Nulgath");
    }
}

export default function main(): void {
    const script = new ShadowLegacyofNulgath();
    Core.setOptions();

    script.getSLoN();

    Core.setOptions(false);
}
