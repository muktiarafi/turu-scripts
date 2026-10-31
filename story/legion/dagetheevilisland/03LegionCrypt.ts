/*
name: Legion Crypt
description: This will finish the Legion Crypt quest.
tags: story, quest, legion, dage-the-evil-island, legion-crypt
*/
// Port of Scripts/Story/Legion/DageTheEvilIsland/03LegionCrypt.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageTheEvilIsland } from "./CoreDageTheEvilIsland";

const coreDageTheEvilIsland = new CoreDageTheEvilIsland();

export class LegionCrypt {}

export default function main(): void {
    Core.setOptions();

    coreDageTheEvilIsland.legionCrypt();

    Core.setOptions(false);
}
