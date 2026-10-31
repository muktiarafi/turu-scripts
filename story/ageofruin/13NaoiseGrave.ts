/*
name: Naoise Grave
description: This script completes the st oryline in /naoisegrave.
tags: age, of, ruin, saga, story, quest, naoisegrave, queen victoria alteon
*/
// Port of Scripts/Story/AgeOfRuin/13NaoiseGrave.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class NaoiseGrave {}

export default function main(): void {
    Core.setOptions();

    AOR.naoiseGrave();

    Core.setOptions(false);
}
