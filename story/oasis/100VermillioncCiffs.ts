/*
name: VermillioncCiffs Story
description: This will finish the VermillioncCiffs Story.
tags: story, quest, Crulon Wed, VermillioncCiffs
*/
// Port of Scripts/Story/Oasis/100VermillioncCiffs.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class VermillioncCiffs {}

export default function main(): void {
    Core.setOptions();

    COA.vermillionCliffs();

    Core.setOptions(false);
}
