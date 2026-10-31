/*
name: UW3017
description: null
tags: legion, legion token
*/
// Port of Scripts/Legion/LegionTokens/UW3017.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreLegion } from "../CoreLegion";

const Legion = new CoreLegion();

export class UW3017TLs {}

export default function main(): void {
    Core.setOptions();

    Legion.ltuw3017();

    Core.setOptions(false);
}
