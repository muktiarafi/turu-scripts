/*
name: LegionFealty2
description: null
tags: null
*/
// Port of Scripts/Legion/Revenant/LegionFealty2.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLR } from "./CoreLR";

const LR = new CoreLR();

export class LegionFealty2 {}

export default function main(): void {
    Core.setOptions();

    LR.conquestWreath();

    Core.setOptions(false);
}
