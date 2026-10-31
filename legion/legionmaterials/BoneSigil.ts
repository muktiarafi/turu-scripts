/*
name: MaxBoneSigil
description: farms BoneSigil till max quantity
tags: legion, dage, BoneSigil, 🖕, you
*/
// Port of Scripts/Legion/LegionMaterials/BoneSigil.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const CL = new CoreLegion();

export class BoneSigil {
    getBoneSigil(): void {
        CL.boneSigil();
    }
}

export default function main(): void {
    const script = new BoneSigil();
    Core.setOptions();

    script.getBoneSigil();

    Core.setOptions(false);
}
