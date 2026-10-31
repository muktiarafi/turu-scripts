/*
name: Diamond Token of Dage
description: This script will farm Diamond Tokens of Dage.
tags: diamond token, dage, diamond, token, lf3, legion fealty 3, lr, legion loyalty rewarded, shadowblast arena
*/
// Port of Scripts/Legion/LegionMaterials/DiamondTokenofDage.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class DiamondTokenofDage {}

export default function main(): void {
    Core.setOptions();

    Legion.diamondTokenofDage();

    Core.setOptions(false);
}
