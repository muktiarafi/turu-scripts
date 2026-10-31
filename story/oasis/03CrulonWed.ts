/*
name: CrulonWed Story
description: This will finish the CrulonWed Story.
tags: story, quest, Crulon Wed, CrulonWed
*/
// Port of Scripts/Story/Oasis/03CrulonWed.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class CrulonWed {}

export default function main(): void {
    Core.setOptions();

    COA.crulonWed();

    Core.setOptions(false);
}
