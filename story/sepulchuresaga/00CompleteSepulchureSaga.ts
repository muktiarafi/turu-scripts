/*
name: Complete Sepulchure Saga Story
description: This will finish the Sepulchure Saga story.
tags: story, quest, sepulchure-saga, complete, all
*/
// Port of Scripts/Story/SepulchureSaga/00CompleteSepulchureSaga.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSepulchure } from "./CoreSepulchure";

const CoreSS = new CoreSepulchure();

export class CompleteSS {}

export default function main(): void {
    Core.setOptions();

    CoreSS.completeSS();

    Core.setOptions(false);
}
