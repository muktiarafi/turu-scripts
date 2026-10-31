/*
name: EmblemofNulgath
description: null
tags: null
*/
// Port of Scripts/Nation/EmblemofNulgath.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../core/CoreBots";
import { CoreNation } from "./CoreNation";

const Nation = new CoreNation();

export class EmblemofNulgath {}

export default function main(): void {
    Core.setOptions();

    Nation.emblemofNulgath();

    Core.setOptions(false);
}
