/*
name: LegionFealty1
description: null
tags: null
*/
// Port of Scripts/Legion/Revenant/LegionFealty1.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLR } from "./CoreLR";

const LR = new CoreLR();

export class LegionFealty1 {}

export default function main(): void {
    Core.setOptions();

    LR.revenantSpellscroll();

    Core.setOptions(false);
}
