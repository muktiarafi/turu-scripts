/*
name: Legion Revenant (Full)
description: Does the entirety of the `Legion Revenant` class grind, from A to Z
tags: legion, revenant, fealty, class, LR, do all, full
*/
// Port of Scripts/Legion/Revenant/0LegionRevenant.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLR } from "./CoreLR";

const LR = new CoreLR();

export class LegionFealty4 {}

export default function main(): void {
    Core.setOptions();

    LR.getLR(true);

    Core.setOptions(false);
}
