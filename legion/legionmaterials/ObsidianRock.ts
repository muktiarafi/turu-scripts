/*
name: MaxObsidianRock
description: farms ObsidianRock till max quantity
tags: legion, dage, ObsidianRock, 🖕, you
*/
// Port of Scripts/Legion/LegionMaterials/ObsidianRock.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const CL = new CoreLegion();

export class ObsidianRock {
    getObsidianRock(): void {
        CL.obsidianRock();
    }
}

export default function main(): void {
    const script = new ObsidianRock();
    Core.setOptions();

    script.getObsidianRock();

    Core.setOptions(false);
}
