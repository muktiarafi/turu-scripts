/*
name: SpellCrafting REP
description: This script will farm SpellCrafting reputation to rank 10.
tags: spell crafting, spellcrafting, rep, spell, spellcraft, rep, rank, reputation
*/
// Port of Scripts/Farm/REP/SpellCraftingREP.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreFarms } from "../../core/CoreFarms";

const Farm = new CoreFarms();

export class SpellCraftingREP {}

export default function main(): void {
    Core.setOptions();

    Farm.spellCraftingREP();

    Core.setOptions(false);
}
