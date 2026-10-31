/*
name: The Book
description: This will finish the The Book quest.
tags: story, quest, queen-of-monsters, the-book
*/
// Port of Scripts/Story/QueenofMonsters/8TheBook.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class TheBook {}

export default function main(): void {
    Core.setOptions();

    QOM.theBook();

    Core.setOptions(false);
}
