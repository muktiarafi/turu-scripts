/*
name: (Summer) Collector
description: This will finish the Collector story.
tags: collector, summer, 2015, adventure, map, farm, story, collector, summer, 2015, adventure, map
*/
// Port of Scripts/Story/Summer2015AdventureMap/4Collector.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class Collector {}

export default function main(): void {
    Core.setOptions();

    Summer.collector();

    Core.setOptions(false);
}
