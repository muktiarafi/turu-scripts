/*
name: CarcossaCabins Story
description: This will finish the CarcossaCabins Story.
tags: story, quest, Crulon Wed, CarcossaCabins
*/
// Port of Scripts/Story/Oasis/05CarcossaCabins.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class CarcossaCabins {}

export default function main(): void {
    Core.setOptions();

    COA.carcossaCabins();

    Core.setOptions(false);
}
