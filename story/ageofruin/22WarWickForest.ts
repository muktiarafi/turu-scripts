/*
name: War Wick Forest
description: Completes theWarWick Forest storyline.
tags: warwickforest, storyline,aor,age of ruin, albedo,aleister,jaania
*/
// Port of Scripts/Story/AgeOfRuin/22WarWickForest.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class WarWickForest {}

export default function main(): void {
    Core.setOptions();
    AOR.warWickForest();
    Core.setOptions(false);
}
