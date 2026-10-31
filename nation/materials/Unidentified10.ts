/*
name: Unidentified10
description: null
tags: null
*/
// Port of Scripts/Nation/Materials/Unidentified10.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class Uni10 {}

export default function main(): void {
    Core.setOptions();

    Nation.farmUni10();

    Core.setOptions(false);
}
