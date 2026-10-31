/*
name: EvolvedShadowOrb[Mem]
description: null
tags: null
*/
// Port of Scripts/Nation/EvolvedOrb/EvolvedShadowOrb[Mem].cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class EvolvedShadowOrb {
    getEvolvedShadowOrb(): void {
        if (Core.checkInventory("Evolved Shadow Orb") || !Core.isMember) {
            return;
        }
        Nation.approvalAndFavor(200, 0);
        Nation.farmUni13(3);
        Nation.farmVoucher({ member: false });
        Nation.farmVoucher({ member: true });
        Nation.farmTotemofNulgath(10);
        Nation.farmGemofNulgath(20);
        Core.buyItem("archportal", 1211, "Evolved Shadow Orb");
        Core.logger(`Done, you have Shadow ball`);
    }
}

export default function main(): void {
    const script = new EvolvedShadowOrb();
    Core.setOptions();
    script.getEvolvedShadowOrb();
    Core.setOptions(false);
}
