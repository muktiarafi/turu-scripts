/*
name: (Deadmoor) Summer 2015 Adventure Map Story
description: This will finish the Deadmoor story.
tags: deadmoor, summer, 2015, adventure, map, farm, story, deadmoor, summer, 2015, adventure, map
*/
// Port of Scripts/Story/Summer2015AdventureMap/2Deadmoor.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class Deadmoor {}

export default function main(): void {
    Core.setOptions();

    Summer.deadmoor();

    Core.setOptions(false);
}
