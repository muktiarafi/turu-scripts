/*
name: Complete 7 Deadly Dragons
description: This will complete the 7 Deadly Dragons story.
tags: story, quest, 7-deadly-dragons, complete, all
*/
// Port of Scripts/Story/7DeadlyDragons/00SevenDeadlyDragons.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core7DD } from "./Core7DD";

const DD = new Core7DD();

export class Complete7DeadlyDragons {}

export default function main(): void {
    Core.setOptions();

    DD.complete7DD();

    Core.setOptions(false);
}
