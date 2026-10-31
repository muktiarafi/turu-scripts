/*
name: (Cyseros) Secret
description: This will finish the Cyseros Secret story.
tags: cyseros, secret, summer, 2015, adventure, map, farm, story, cyseros, secret, summer, 2015, adventure, map
*/
// Port of Scripts/Story/Summer2015AdventureMap/7CyserosSecret.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../core/CoreBots";
import { CoreSummer } from "./CoreSummer";

const Summer = new CoreSummer();

export class CyserosSecret {}

export default function main(): void {
    Core.setOptions();

    Summer.cyserosSecret();

    Core.setOptions(false);
}
