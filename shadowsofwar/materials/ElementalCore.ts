/*
name: Farms Elemental Core
description: Farms the Elemental Core from Shadows of War
tags: elemental core, shadows of war
*/
// Port of Scripts/ShadowsOfWar/Materials/ElementalCore.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSoWMats } from "../CoreSoWMats";

const SOWM = new CoreSoWMats();

export class ElementalCore {}

export default function main(): void {
    Core.bankingBlackList.push("Elemental Core");

    Core.setOptions();

    SOWM.elementalCore();

    Core.setOptions(false);
}
