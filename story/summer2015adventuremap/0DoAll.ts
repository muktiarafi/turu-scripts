/*
name: (Summer) Complete Summer 2015 Adventure Map Story
description: This will finish the Summer 2015 Adventure Map story.
tags: summer, 2015, adventure, map, farm, story, complete, summer, 2015, adventure, map, all
*/
// Port of Scripts/Story/Summer2015AdventureMap/0DoAll.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class DoAllSummer {}

export default function main(): void {
    Core.setOptions();

    Summer.doAll();

    Core.setOptions(false);
}
