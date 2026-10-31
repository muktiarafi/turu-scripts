/*
name: Ashray Village
description: This script completes the storyline in /ashray.
tags: age, of, ruin, saga, story, quest, ashray, village
*/
// Port of Scripts/Story/AgeOfRuin/02AshrayVillage.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class AshrayVillage {}

export default function main(): void {
    Core.setOptions();

    AOR.ashrayVillage();
    Core.setOptions(false);
}
