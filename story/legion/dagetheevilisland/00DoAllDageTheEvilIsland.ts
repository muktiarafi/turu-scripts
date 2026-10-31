/*
name: Complete Dage The Evil Island Story
description: This will complete the Dage The Evil Island story.
tags: story, quest, legion, dage-the-evil-island, complete, all
*/
// Port of Scripts/Story/Legion/DageTheEvilIsland/00DoAllDageTheEvilIsland.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageTheEvilIsland } from "./CoreDageTheEvilIsland";

const coreDageTheEvilIsland = new CoreDageTheEvilIsland();

export class DoAllDageTheEvillMapStory {}

export default function main(): void {
    Core.setOptions();

    coreDageTheEvilIsland.completeDageTheEvilIslandStory();

    Core.setOptions(false);
}
