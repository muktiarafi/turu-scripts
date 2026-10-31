/*
name: ArcaneLocus
description: null
tags: null
*/
// Port of Scripts/Other/Classes/ArchMage/Materials/ArcaneLocus.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../../core/CoreBots";
import { CoreArchMage } from "../CoreArchMage";

const AM = new CoreArchMage();

export class ArcaneLocus {}

export default function main(): void {
    Core.setOptions();

    AM.arcaneLocus(99);

    Core.setOptions(false);
}
