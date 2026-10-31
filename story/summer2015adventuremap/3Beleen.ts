/*
name: (Beleen) Summer 2015 Adventure Map Story
description: This will finish the Beleen story.
tags: beleen, summer, 2015, adventure, map, farm, story, beleen, summer, 2015, adventure, map
*/
// Port of Scripts/Story/Summer2015AdventureMap/3Beleen.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class Beleen {}

export default function main(): void {
    Core.setOptions();

    Summer.beleen();

    Core.setOptions(false);
}
