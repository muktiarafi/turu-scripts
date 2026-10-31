/*
name: EvolvedBloodOrb
description: null
tags: null
*/
// Port of Scripts/Nation/EvolvedOrb/EvolvedBloodOrb.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class EvolvedBloodOrb {
    getEvolvedBloodOrb(): void {
        if (Core.checkInventory("Evolved Blood Orb")) {
            return;
        }
        Nation.approvalAndFavor(200, 0);
        Nation.farmUni13(3);
        Nation.farmVoucher({ member: false });
        Nation.farmTotemofNulgath(10);
        Nation.farmDiamondofNulgath(30);
        Core.buyItem("archportal", 1211, 33196, undefined, 4181);
        Core.logger(`Done, you have Blood ball`);
    }
}

export default function main(): void {
    const script = new EvolvedBloodOrb();
    Core.setOptions();
    script.getEvolvedBloodOrb();
    Core.setOptions(false);
}
