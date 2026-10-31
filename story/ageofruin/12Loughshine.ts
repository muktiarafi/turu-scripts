/*
name: Loughshine
description: This script completes the storyline in /loughshine.
tags: age, of, ruin, saga, story, quest, loughshine, lough shine, ruins of loughshine, caoimhe
*/
// Port of Scripts/Story/AgeOfRuin/12Loughshine.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreAOR } from "./CoreAOR";

const AOR = new CoreAOR();

export class Loughshine {}

export default function main(): void {
    Core.setOptions();

    AOR.loughshine();

    Core.setOptions(false);
}
