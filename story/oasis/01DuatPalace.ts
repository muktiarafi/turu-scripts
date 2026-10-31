/*
name: DuatPalace Story
description: This will finish the Duat Palace Story.
tags: story, quest, duat palace, duatpalace
*/
// Port of Scripts/Story/Oasis/01DuatPalace.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreOasis } from "./CoreOasis";

const COA = new CoreOasis();

export class DuatPalace {}

export default function main(): void {
    Core.setOptions();

    COA.duatPalace();

    Core.setOptions(false);
}
