/*
name: Rubedo Peak
description: Completes Rubedo Peak storyline.
tags: RubedoPeak, Rubedo Peak, storyline,aor,age of ruin, albedo,aleister,jaania
*/
// Port of Scripts/Story/AgeOfRuin/24RubedoPeak.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class RubedoPeak {}

export default function main(): void {
    Core.setOptions();
    AOR.rubedoPeak();
    Core.setOptions(false);
}
