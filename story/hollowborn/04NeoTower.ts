/*
name: Neo Tower
description: This script will complete the Lae's storyline in /neotower.
tags: hollowborn, saga, lae, neotower, neo tower, quest
*/
// Port of Scripts/Story/Hollowborn/04NeoTower.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "./CoreHollowbornStory";

const HB = new CoreHollowbornStory();

export class NeoTower {}

export default function main(): void {
    Core.setOptions();

    HB.neoTower();

    Core.setOptions(false);
}
