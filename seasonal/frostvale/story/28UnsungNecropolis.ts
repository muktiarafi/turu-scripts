/*
name: Unsung Necropolis Story
description: This script completes the UnsungNecropolis quests.
tags: saga, story, quest, seasonal, frostval,frostvale,frost,unsungnecropolis,blank reflection,unsung, necropolis
*/
// Port of Scripts/Seasonal/Frostvale/Story/28UnsungNecropolis.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreFrostvale } from "./CoreFrostvale";

const Frost = new CoreFrostvale();

export class UnsungNecropolis {}

export default function main(): void {
    Core.setOptions();
    Frost.unsungNecropolis();
    Core.setOptions(false);
}
