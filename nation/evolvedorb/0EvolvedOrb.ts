/*
name: 0EvolvedOrb
description: null
tags: null
*/
// Port of Scripts/Nation/EvolvedOrb/0EvolvedOrb.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { EvolvedBloodOrb } from "./EvolvedBloodOrb";
import { EvolvedHexOrb } from "./EvolvedHexOrb";
import { EvolvedShadowOrb } from "./EvolvedShadowOrb[Mem]";
import { EvolvedShadowOrbItems } from "./EvolvedShadowOrbItems[Mem]";

const EBO = new EvolvedBloodOrb();
const EHO = new EvolvedHexOrb();
const ESO = new EvolvedShadowOrb();
const ESOItems = new EvolvedShadowOrbItems();

export class EvolvedOrb {
    doBoth(): void {
        this.getAllOrb();
        this.getAllItems();
    }

    getAllOrb(): void {
        EBO.getEvolvedBloodOrb();
        EHO.getEvolvedHexOrb();
        ESO.getEvolvedShadowOrb();
        Core.logger(`Done, you have the balls`);
    }

    getAllItems(): void {
        ESOItems.getItems();
        Core.logger(`Done, you have hatched the balls`);
    }
}

export default function main(): void {
    const script = new EvolvedOrb();
    Core.setOptions();

    script.doBoth();

    Core.setOptions(false);
}
