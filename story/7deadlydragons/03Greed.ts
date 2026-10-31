/*
name: Greed
description: This will finish the Greed quest.
tags: story, quest, 7-deadly-dragons, greed
*/
// Port of Scripts/Story/7DeadlyDragons/03Greed.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { Core7DD } from "./Core7DD";

const DD = new Core7DD();

export class Greed {}

export default function main(): void {
    Core.setOptions();

    DD.greed();

    Core.setOptions(false);
}
