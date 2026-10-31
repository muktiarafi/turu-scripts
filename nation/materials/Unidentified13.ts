/*
name: Unidentified13
description: null
tags: null
*/
// Port of Scripts/Nation/Materials/Unidentified13.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class Uni13 {}

export default function main(): void {
    Core.setOptions();

    Nation.farmUni13(13);

    Core.setOptions(false);
}
