/*
name: Forge Albedo
description: Completes the Forge Albedo storyline.
tags: forgealbedo, storyline,aor,age of ruin, albedo,aleister,jaania
*/
// Port of Scripts/Story/AgeOfRuin/20ForgeAlbedo.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class ForgeAlbedo {}

export default function main(): void {
    Core.setOptions();
    AOR.forgeAlbedo();
    Core.setOptions(false);
}
