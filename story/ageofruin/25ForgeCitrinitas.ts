/*
name: Forge Citrinitas
description: Completes  Forge Citrinitas storyline.
tags: ForgeCitrinitas, Forge Citrinitas, storyline,aor,age of ruin, albedo,aleister,jaania
*/
// Port of Scripts/Story/AgeOfRuin/25ForgeCitrinitas.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class ForgeCitrinitas {}

export default function main(): void {
    Core.setOptions();
    AOR.forgeCitrinitas();
    Core.setOptions(false);
}
