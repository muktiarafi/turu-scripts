/*
name: Farms Acquiescence
description: Farms the Acquiescence from Shadows of War
tags: acquiescence, shadows of war
*/
// Port of Scripts/ShadowsOfWar/Materials/Acquiescence.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoWMats } from "../CoreSoWMats";

const SOWM = new CoreSoWMats();

export class Acquiescence {}

export default function main(): void {
    Core.bankingBlackList.push("Acquiescence");

    Core.setOptions();

    SOWM.acquiescence();

    Core.setOptions(false);
}
