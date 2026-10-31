/*
name: MeresankhChambers Story
description: This will finish the MeresankhChambers Story.
tags: story, quest, Crulon Wed, MeresankhChambers
*/
// Port of Scripts/Story/Oasis/04MeresankhChambers.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class MeresankhChambers {}

export default function main(): void {
    Core.setOptions();

    COA.meresankhChambers();

    Core.setOptions(false);
}
