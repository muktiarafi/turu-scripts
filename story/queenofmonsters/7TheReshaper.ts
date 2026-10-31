/*
name: The Reshaper
description: This will finish the The Reshaper quest.
tags: story, quest, queen-of-monsters, the-reshaper
*/
// Port of Scripts/Story/QueenofMonsters/7TheReshaper.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompleteTheReshaper {}

export default function main(): void {
    Core.setOptions();

    QOM.theReshaper();

    Core.setOptions(false);
}
