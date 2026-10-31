/*
name: (Summer) Luna Cove
description: This will finish the Luna Cove story.
tags: luna, cove, summer, 2015, adventure, map, farm, story, luna, cove, summer, 2015, adventure, map
*/
// Port of Scripts/Story/Summer2015AdventureMap/6LunaCove.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class LunaCove {}

export default function main(): void {
    Core.setOptions();

    Summer.lunaCove();

    Core.setOptions(false);
}
