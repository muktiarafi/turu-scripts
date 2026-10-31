/*
name: Dark Fortress
description: This will finish the Dark Fortress quest.
tags: story, quest, legion, dage-the-evil-island, dark-fortress
*/
// Port of Scripts/Story/Legion/DageTheEvilIsland/01DarkFortress.cs.
// Converted by tools/cs2ts, not yet read through by hand (cs2ts --force regenerates it); remove this line once it is.

import { Core } from "../../../core/CoreBots";
import { CoreDageTheEvilIsland } from "./CoreDageTheEvilIsland";

const coreDageTheEvilIsland = new CoreDageTheEvilIsland();

export class DarkFortress {}

export default function main(): void {
    Core.setOptions();

    coreDageTheEvilIsland.darkFortress();

    Core.setOptions(false);
}
