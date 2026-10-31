/*
name: SoulForge Hammer
description: This script will get SoulForge Hammer.
tags: soul, forge, soulforge, hammer, unlock soul forge, soul forge hammer, legion, dage, underworld
*/
// Port of Scripts/Legion/LegionMaterials/SoulForgeHammer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class SoulForgeHammer {}

export default function main(): void {
    Core.setOptions();

    Legion.soulForgeHammer();

    Core.setOptions(false);
}
