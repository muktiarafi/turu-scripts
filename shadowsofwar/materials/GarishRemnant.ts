/*
name: Farms Garish Remnant
description: Farms the Garish Remnant from Shadows of War
tags: garish remnant, shadows of war
*/
// Port of Scripts/ShadowsOfWar/Materials/GarishRemnant.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoWMats } from "../CoreSoWMats";

const SOWM = new CoreSoWMats();

export class GarishRemnant {}

export default function main(): void {
    Core.bankingBlackList.push("Garish Remnant");

    Core.setOptions();

    SOWM.garishRemnant();

    Core.setOptions(false);
}
