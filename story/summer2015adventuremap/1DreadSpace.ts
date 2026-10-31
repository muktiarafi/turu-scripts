/*
name: (Dread Space) Summer 2015 Adventure Map Story
description: This will finish the Dread Space story.
tags: dread, space, summer, 2015, adventure, map, farm, story, dread, space
*/
// Port of Scripts/Story/Summer2015AdventureMap/1DreadSpace.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class DreadSpace {}

export default function main(): void {
    Core.setOptions();

    Summer.dreadSpace();

    Core.setOptions(false);
}
