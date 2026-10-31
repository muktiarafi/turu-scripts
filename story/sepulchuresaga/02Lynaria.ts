/*
name: Lynaria
description: This will finish the Lynaria quest.
tags: story, quest, sepulchure-saga, lynaria
*/
// Port of Scripts/Story/SepulchureSaga/02Lynaria.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSepulchure } from "./CoreSepulchure";

const CoreSS = new CoreSepulchure();

export class Lynaria {}

export default function main(): void {
    Core.setOptions();

    CoreSS.lynaria();

    Core.setOptions(false);
}
