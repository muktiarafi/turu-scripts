/*
name: LegionFealty3
description: null
tags: null
*/
// Port of Scripts/Legion/Revenant/LegionFealty3.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLR } from "./CoreLR";

const LR = new CoreLR();

export class LegionFealty3 {}

export default function main(): void {
    Core.setOptions();

    LR.exaltedCrown();

    Core.setOptions(false);
}
