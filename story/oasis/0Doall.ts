/*
name: OasisDoaAll
description: This will finish the Duat Palace Story.
tags: story, quest, duat palace, Oasis, Do, all, 0doall, do all, oasis do all, DuatPalace, CrocRiver, CrulonWed, MeresankhChambers
*/
// Port of Scripts/Story/Oasis/0Doall.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class OasisDoaAll {}

export default function main(): void {
    Core.setOptions();

    COA.doAll();

    Core.setOptions(false);
}
