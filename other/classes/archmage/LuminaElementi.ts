/*
name: LuminaElementi
description: null
tags: null
*/
// Port of Scripts/Other/Classes/ArchMage/LuminaElementi.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreArchMage } from "./CoreArchMage";

const AM = new CoreArchMage();

export class LuminaElementi {}

export default function main(): void {
    Core.setOptions();

    AM.luminaElementi(true);

    Core.setOptions(false);
}
