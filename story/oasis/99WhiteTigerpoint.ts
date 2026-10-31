/*
name: WhiteTigerpoint Story
description: This will finish the WhiteTigerpoint Story.
tags: story, quest, Crulon Wed, WhiteTigerpoint
*/
// Port of Scripts/Story/Oasis/99WhiteTigerpoint.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class WhiteTigerpoint {}

export default function main(): void {
    Core.setOptions();

    COA.whitetigerpoint();

    Core.setOptions(false);
}
