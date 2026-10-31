/*
name: Swordhaven The New World
description: This will finish the Swordhaven The New World quest.
tags: story, quest, queen-of-monsters, swordhaven-the-new-world
*/
// Port of Scripts/Story/QueenofMonsters/5SwordhavenTheNewWorld.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompleteTheNewWorld {}

export default function main(): void {
    Core.setOptions();

    QOM.swordhavenTheNewWorld();

    Core.setOptions(false);
}
