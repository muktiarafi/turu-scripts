/*
name: Sanctuary Aiwass Storyline
description: Completes the Sanctuary Aiwass storyline (quests 10375–10384)
tags: sanctuaryaiwass, storyline
*/
// Port of Scripts/Story/AgeOfRuin/19SanctuaryAiwass.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class SanctuaryAiwass {}

export default function main(): void {
    Core.setOptions();
    AOR.sanctuaryAiwass();
    Core.setOptions(false);
}
