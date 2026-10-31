/*
name: DiamondofNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/Materials/DiamondofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreNation } from "../CoreNation";

const Nation = new CoreNation();

export class DiamondofNulgath {}

export default function main(): void {
    Core.setOptions();

    Nation.farmDiamondofNulgath();

    Core.setOptions(false);
}
