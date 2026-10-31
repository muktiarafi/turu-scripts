/*
name: Magnum Opus
description: Completes Magnum Opus storyline.
tags: MagnumOpus,Magnum Opus, storyline,aor,age of ruin, albedo,aleister,jaania
*/
// Port of Scripts/Story/AgeOfRuin/23MagnumOpus.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class MagnumOpus {}

export default function main(): void {
    Core.setOptions();
    AOR.magnumOpus();
    Core.setOptions(false);
}
