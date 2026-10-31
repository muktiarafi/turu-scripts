/*
name: Lust
description: This will finish the Lust quest.
tags: story, quest, 7-deadly-dragons, lust
*/
// Port of Scripts/Story/7DeadlyDragons/05Lust.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core7DD } from "./Core7DD";

const DD = new Core7DD();

export class Lust {}

export default function main(): void {
    Core.setOptions();

    DD.lust();

    Core.setOptions(false);
}
