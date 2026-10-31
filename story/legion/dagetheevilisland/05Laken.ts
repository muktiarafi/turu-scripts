/*
name: Laken
description: This will finish the Laken quest.
tags: story, quest, legion, dage-the-evil-island, laken
*/
// Port of Scripts/Story/Legion/DageTheEvilIsland/05Laken.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageTheEvilIsland } from "./CoreDageTheEvilIsland";

const coreDageTheEvilIsland = new CoreDageTheEvilIsland();

export class Laken {}

export default function main(): void {
    Core.setOptions();

    coreDageTheEvilIsland.laken();

    Core.setOptions(false);
}
