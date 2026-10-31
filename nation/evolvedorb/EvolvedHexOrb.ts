/*
name: EvolvedHexOrb
description: null
tags: null
*/
// Port of Scripts/Nation/EvolvedOrb/EvolvedHexOrb.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class EvolvedHexOrb {
    getEvolvedHexOrb(): void {
        if (Core.checkInventory("Evolved Hex Orb")) {
            return;
        }
        Nation.approvalAndFavor(200, 0);
        Nation.farmUni13(3);
        Nation.farmVoucher({ member: false });
        Nation.farmTotemofNulgath(10);
        Nation.farmDarkCrystalShard(30);
        Nation.farmTaintedGem(30);
        Core.buyItem("archportal", 1211, "Evolved Hex Orb");
        Core.logger(`Done, you have Hex ball`);
    }
}

export default function main(): void {
    const script = new EvolvedHexOrb();
    Core.setOptions();
    script.getEvolvedHexOrb();
    Core.setOptions(false);
}
