/*
name: Pride
description: This will finish the Pride quest.
tags: story, quest, 7-deadly-dragons, pride
*/
// Port of Scripts/Story/7DeadlyDragons/02Pride.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core7DD } from "./Core7DD";

const DD = new Core7DD();

export class Pride {}

export default function main(): void {
    Core.setOptions();

    DD.pride();

    Core.setOptions(false);
}
