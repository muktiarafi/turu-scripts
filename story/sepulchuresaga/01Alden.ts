/*
name: Alden
description: This will finish the Alden quest.
tags: story, quest, sepulchure-saga, alden
*/
// Port of Scripts/Story/SepulchureSaga/01Alden.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSepulchure } from "./CoreSepulchure";

const CoreSS = new CoreSepulchure();

export class Alden {}

export default function main(): void {
    Core.setOptions();

    CoreSS.alden();

    Core.setOptions(false);
}
