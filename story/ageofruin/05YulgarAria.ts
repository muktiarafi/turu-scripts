/*
name: Yulgar + Aria
description: This script completes the Yulgar's storyline in /sunlightzone.
tags: age, of, ruin, saga, story, quest, yulgar, aria, father, day, venomous, rose
*/
// Port of Scripts/Story/AgeOfRuin/05YulgarAria.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class YulgarAria {}

export default function main(): void {
    Core.setOptions();

    AOR.yulgarAria();
    Core.setOptions(false);
}
