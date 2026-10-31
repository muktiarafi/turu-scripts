/*
name: CarcossaCourt Story
description: This will finish the CarcossaCourt Story.
tags: story, quest, Crulon Wed, CarcossaCourt
*/
// Port of Scripts/Story/Oasis/06CarcossaCourt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class CarcossaCourt {}

export default function main(): void {
    Core.setOptions();

    COA.carcossaCourt();

    Core.setOptions(false);
}
