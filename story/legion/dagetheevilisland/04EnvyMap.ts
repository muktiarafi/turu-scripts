/*
name: Envy Map
description: This will finish the Envy Map quest.
tags: story, quest, legion, dage-the-evil-island, envy-map
*/
// Port of Scripts/Story/Legion/DageTheEvilIsland/04EnvyMap.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageTheEvilIsland } from "./CoreDageTheEvilIsland";

const coreDageTheEvilIsland = new CoreDageTheEvilIsland();

export class EnvyMap {}

export default function main(): void {
    Core.setOptions();

    coreDageTheEvilIsland.envyMap();

    Core.setOptions(false);
}
