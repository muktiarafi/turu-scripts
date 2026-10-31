/*
name: MaxEmblemofDage
description: farms EmblemofDage till max quantity
tags: legion, dage, EmblemofDage, 🖕, you
*/
// Port of Scripts/Legion/LegionMaterials/EmblemofDage.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const CL = new CoreLegion();

export class EmblemofDage {
    getEmblemofDage(): void {
        CL.emblemofDage();
    }
}

export default function main(): void {
    const script = new EmblemofDage();
    Core.setOptions();

    script.getEmblemofDage();

    Core.setOptions(false);
}
