/*
name: Seraph
description: This will finish the Seraph quest.
tags: story, quest, legion, dage-the-evil-island, seraph
*/
// Port of Scripts/Story/Legion/DageTheEvilIsland/02Seraph.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageTheEvilIsland } from "./CoreDageTheEvilIsland";

const coreDageTheEvilIsland = new CoreDageTheEvilIsland();

export class Seraph {}

export default function main(): void {
    Core.setOptions();

    coreDageTheEvilIsland.seraph();

    Core.setOptions(false);
}
