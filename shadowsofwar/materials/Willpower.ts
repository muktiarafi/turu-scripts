/*
name: Farms Willpower
description: Farms the Willpower from Shadows of War
tags: willpower, shadows of war
*/
// Port of Scripts/ShadowsOfWar/Materials/Willpower.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoWMats } from "../CoreSoWMats";

const SOWM = new CoreSoWMats();

export class Willpower {}

export default function main(): void {
    Core.bankingBlackList.push("Willpower");

    Core.setOptions();

    SOWM.willpower();

    Core.setOptions(false);
}
