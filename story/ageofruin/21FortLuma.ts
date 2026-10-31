/*
name: Fort Luma
description: Completes the Fort Luma storyline.
tags: forgealbedo, storyline,aor,age of ruin, albedo,aleister,jaania
*/
// Port of Scripts/Story/AgeOfRuin/21FortLuma.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class FortLuma {}

export default function main(): void {
    Core.setOptions();
    AOR.fortLuma();
    Core.setOptions(false);
}
