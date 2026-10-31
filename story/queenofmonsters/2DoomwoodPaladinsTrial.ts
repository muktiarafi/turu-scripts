/*
name: Doomwood Paladins Trial
description: This will finish the Doomwood Paladins Trial quest.
tags: story, quest, queen-of-monsters, doomwood-paladins-trial
*/
// Port of Scripts/Story/QueenofMonsters/2DoomwoodPaladinsTrial.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreQOM } from "./CoreQoM";

const QOM = new CoreQOM();

export class CompletePaladinsTrial {}

export default function main(): void {
    Core.setOptions();

    QOM.doomwoodPaladinsTrial();

    Core.setOptions(false);
}
