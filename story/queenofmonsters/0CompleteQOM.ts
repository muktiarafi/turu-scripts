/*
name: Complete Queen of Monsters Story
description: This will complete the Queen of Monsters story arc.
tags: story, quest, queen-of-monsters, complete, all
*/
// Port of Scripts/Story/QueenofMonsters/0CompleteQOM.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompleteQOM {}

export default function main(): void {
    Core.setOptions();

    QOM.completeEverything();

    Core.setOptions(false);
}
