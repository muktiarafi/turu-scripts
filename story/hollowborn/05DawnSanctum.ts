/*
name: Dawn Vindicators' Sanctum
description: This script will complete the Lae's storyline in /dawnsanctum.
tags: hollowborn, saga, lae, dawn, dawn sanctum, quest,vindicators, sanctum,dawnsanctum
*/
// Port of Scripts/Story/Hollowborn/05DawnSanctum.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreHollowbornStory } from "./CoreHollowbornStory";

const HB = new CoreHollowbornStory();

export class DawnSanctum {}

export default function main(): void {
    Core.setOptions();

    HB.dawnSanctum();

    Core.setOptions(false);
}
