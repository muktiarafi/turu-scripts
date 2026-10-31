/*
name: Trygve
description: This script will complete the storyline in /trygve.
tags: hollowborn, saga, trygve, neofortress, lae
*/
// Port of Scripts/Story/Hollowborn/01Trygve.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "./CoreHollowbornStory";

const HB = new CoreHollowbornStory();

export class Trygve {}

export default function main(): void {
    Core.setOptions();

    HB.trygve();

    Core.setOptions(false);
}
