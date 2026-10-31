/*
name: Sepulchure's Rise
description: This will finish the Sepulchure's Rise quest.
tags: story, quest, sepulchure-saga, sepulchures-rise
*/
// Port of Scripts/Story/SepulchureSaga/03SepulchuresRise.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSepulchure } from "./CoreSepulchure";

const CoreSS = new CoreSepulchure();

export class SepulchuresRise {}

export default function main(): void {
    Core.setOptions();

    CoreSS.sepulchuresRise();

    Core.setOptions(false);
}
