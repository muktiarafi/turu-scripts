/*
name: The Destroyer
description: This will finish the The Destroyer quest.
tags: story, quest, queen-of-monsters, the-destroyer
*/
// Port of Scripts/Story/QueenofMonsters/6TheDestroyer.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompleteTheDestroyer {}

export default function main(): void {
    Core.setOptions();

    QOM.theDestroyer();

    Core.setOptions(false);
}
